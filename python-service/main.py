import asyncio
import logging
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from adal_agent_sdk import AdalAgentOptions, query

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bayana-ai")

ADAL_AUTH_TOKEN = os.environ.get("ADAL_AUTH_TOKEN", "")
WORKSPACE = "/app"
SYSTEM_PROMPT_PATH = os.path.join(WORKSPACE, "system_prompt.txt")

app = FastAPI(title="Bayana AI Service")

# Enable CORS for your Vercel frontend app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    org_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    options = AdalAgentOptions(
        workspace=WORKSPACE,
        auth_token=ADAL_AUTH_TOKEN,
        permission_mode="yolo",
        # Lock the agent to custom tools only — no file/web/bash access
        disabled_default_tools=["Bash", "Edit", "Read", "Search", "Web", "Image", "Video", "Consult"],
        prompt_file=SYSTEM_PROMPT_PATH,
    )

    # Inject org_id into the prompt so the agent always passes it to tools
    full_prompt = f"[org_id: {req.org_id}]\n\n{req.message}"

    reply = ""
    try:
        # 55s timeout — accommodates Render free tier cold start (~50s)
        async with asyncio.timeout(55):
            async for event in query(prompt=full_prompt, options=options):
                event_type = event.get("type", "")
                logger.info("SDK event: type=%s keys=%s", event_type, list(event.keys()))

                # Cast a wide net — log every event and grab any text we find
                candidate = (
                    event.get("text")
                    or event.get("message")
                    or event.get("content")
                    or event.get("result")
                    or event.get("output")
                )

                if event_type in (
                    "assistant.message.completed",
                    "message",
                    "command.completed",
                    "assistant.message",
                    "final_response",
                    "response",
                ):
                    if candidate:
                        reply = candidate
                        logger.info("Captured reply from event type=%s", event_type)

                elif event_type == "command.failed":
                    logger.error("Agent command failed: %s", event)
                    raise HTTPException(
                        status_code=502,
                        detail=event.get("error", "Agent encountered an error"),
                    )

    except asyncio.TimeoutError:
        logger.error("Agent timed out after 55s")
        raise HTTPException(status_code=504, detail="Agent timed out — please try again")
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error in chat handler")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if not reply:
        logger.warning("No reply captured — check SDK event types in logs above")

    return ChatResponse(reply=reply or "I couldn't retrieve a response. Please try again.")
