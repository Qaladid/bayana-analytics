import asyncio
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from adal_agent_sdk import AdalAgentOptions, query

ADAL_AUTH_TOKEN = os.environ.get("ADAL_AUTH_TOKEN", "")
WORKSPACE = "/app"
SYSTEM_PROMPT_PATH = os.path.join(WORKSPACE, "system_prompt.txt")

app = FastAPI(title="Bayana AI Service")


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
        async with asyncio.timeout(25):
            async for event in query(prompt=full_prompt, options=options):
                event_type = event.get("type", "")

                if event_type in ("assistant.message.completed", "message"):
                    reply = (
                        event.get("text")
                        or event.get("message")
                        or event.get("content")
                        or reply
                    )
                elif event_type == "command.completed":
                    reply = (
                        event.get("text")
                        or event.get("result")
                        or event.get("message")
                        or reply
                    )
                elif event_type == "command.failed":
                    raise HTTPException(
                        status_code=502,
                        detail=event.get("error", "Agent encountered an error"),
                    )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Agent timed out — please try again")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return ChatResponse(reply=reply or "I couldn't retrieve a response. Please try again.")
