import logging
import os
import hmac

from fastapi import FastAPI, HTTPException, Request  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from supabase import create_client, Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bayana-ai")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
INTERNAL_API_SECRET = os.environ.get("INTERNAL_API_SECRET", "")
SYSTEM_PROMPT_PATH = os.path.join("/app", "system_prompt.txt")

app = FastAPI(title="Bayana AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bayana-analytics.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=GROQ_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

with open(SYSTEM_PROMPT_PATH, "r") as f:
    SYSTEM_PROMPT = f.read()


class ChatRequest(BaseModel):
    org_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok"}


def get_stock_levels(org_id: str) -> str:
    res = supabase.table("stock_levels").select("item_name, quantity, branch").eq("org_id", org_id).execute()
    rows = res.data or []
    if not rows:
        return "No stock data found."
    return "\n".join(f"{r['item_name']} ({r['branch']}): {r['quantity']} units" for r in rows)


def get_patient_visits(org_id: str) -> str:
    res = supabase.table("patient_visits").select("branch, count").eq("org_id", org_id).execute()
    rows = res.data or []
    if not rows:
        return "No patient visit data found."
    total = sum(r["count"] for r in rows)
    by_branch = {}
    for r in rows:
        by_branch[r["branch"]] = by_branch.get(r["branch"], 0) + r["count"]
    breakdown = "\n".join(f"{b}: {c} visits" for b, c in by_branch.items())
    return f"Total visits: {total}\n{breakdown}"


def get_revenue(org_id: str) -> str:
    res = supabase.table("revenue").select("branch, period, amount").eq("org_id", org_id).execute()
    rows = res.data or []
    if not rows:
        return "No revenue data found."
    total = sum(float(r["amount"]) for r in rows)
    lines = "\n".join(f"{r['branch']} ({r['period']}): KES {float(r['amount']):,.2f}" for r in rows)
    return f"Total revenue: KES {total:,.2f}\n{lines}"


TOOL_MAP = {
    "get_stock_levels": get_stock_levels,
    "get_patient_visits": get_patient_visits,
    "get_revenue": get_revenue,
}

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_levels",
            "description": "Get current stock levels for the organization.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_patient_visits",
            "description": "Get patient visit counts by branch for the organization.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_revenue",
            "description": "Get revenue figures by branch and period for the organization.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
]


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    provided_secret = request.headers.get("X-Internal-Secret", "")
    if not INTERNAL_API_SECRET or not hmac.compare_digest(provided_secret, INTERNAL_API_SECRET):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.message},
        ]

        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
        )

        response_message = completion.choices[0].message

        if response_message.tool_calls:
            messages.append(response_message)
            for tool_call in response_message.tool_calls:
                fn_name = tool_call.function.name
                fn = TOOL_MAP.get(fn_name)
                result = fn(req.org_id) if fn else "Unknown tool."
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })

            second_completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
            )
            reply = second_completion.choices[0].message.content
        else:
            reply = response_message.content

        return ChatResponse(reply=reply or "I couldn't retrieve a response.")

    except Exception as exc:
        logger.exception("Chat error")
        raise HTTPException(status_code=500, detail=str(exc)) from exc