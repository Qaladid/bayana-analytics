# Integrating AI Guide — Bayana Analytics (AdaL Cloud Chatbot)

> **Mode: vibe coding.** Build this LAST, after auth/schema/upload/dashboard/paywall already work. This layer is additive — the product should demo fine without it if you run out of time.

## What this layer is (and isn't)

This is the **AI chatbot only** — staff asking natural-language questions about data that's already sitting clean in Supabase. It is **not** the Excel schema-normalization system (that's `backend-guide`, and it's a separate ingestion-time problem). Do not conflate these two — a custom_tool that tries to guess column mappings live is the wrong tool for that job.

## Three core AdaL Cloud concepts

- **Agent** = reusable template (system_prompt + custom_tools). Create once, reuse across every conversation.
- **Session** = one actual conversation. Full message history, its own `session_id`, isolated worker.
- **Worker** = the running container executing the agent for a session. Spins up on demand, reaped after ~10 min idle, transparently restarts with full context on next message — you don't manage this lifecycle yourself.

Map: one Agent for the Bayana hospital assistant, one Session per user login or per chat window.

## Connection basics

- Base URL: `https://cloud.adal.sylph.ai`
- Every request needs `Authorization: Bearer <jwt>` and `Content-Type: application/json` on POSTs
- **Server-side only** — a Next.js API route holds the JWT. Never expose it client-side.

## The 4-step flow

1. `POST /v1/agents` — create the agent template once (name, system_prompt, custom_tools)
2. `POST /v1/sessions` — start a conversation, get `session_id`
3. `POST /v1/sessions/{id}/provision` — optional, pre-warms the worker so first message skips the ~60s cold start
4. `POST /v1/sessions/{id}/chat/stream` — send a message, get an SSE stream back

## Custom tools — the actual chatbot capability

Plain Python functions, type hints + docstrings, collected in a module-level `CUSTOM_TOOLS` list. The agent reads docstrings to decide which tool to call and when.

```python
def get_stock_levels(org_id: str, branch: str = None) -> str:
    """Return current stock levels for the given organization, optionally filtered by branch."""
    # query Supabase normalized `stock_levels` table here
    return result

def get_patient_visits(org_id: str, date_range: str) -> str:
    """Return patient visit counts for a date range."""
    # query Supabase normalized `patient_visits` table here
    return result

def get_revenue(org_id: str, branch: str = None, period: str = None) -> str:
    """Return revenue figures, optionally filtered by branch and period."""
    # query Supabase normalized `revenue` table here
    return result

CUSTOM_TOOLS = [get_stock_levels, get_patient_visits, get_revenue]
```

Start with 2-3 tools. Don't over-scope this for a hackathon demo.

## Unresolved: credentials inside the worker container

Open question, not fully confirmed from docs: how these Python functions get Supabase credentials inside AdaL's remote worker container, since the source is sent as a string and executed remotely. Do NOT hardcode connection strings into the tool function body. Options to try, in order:
1. Check whether AdaL supports injecting environment variables into the worker at agent/session creation
2. If not, ask in AdaL's Discord before wiring in real Supabase credentials — this directly affects whether it's safe to use with real hospital data
3. As a last resort for demo purposes only, a scoped/read-only Supabase key with minimal permissions — never the service role key

## Streaming — minimum viable integration

Only two event types matter for a working demo:
- `assistant.message.completed` — the actual answer text (may fire more than once per turn)
- `command.failed` — error handling

Everything else (`thought.delta`, `tool.started`, `tool.completed`, `command.progress`) is optional UI polish ("checking stock levels...") — skip it if time is short.

## Integration shape

```
Browser chat widget
  → Next.js API route (holds AdaL JWT server-side)
      → POST /v1/sessions/{id}/chat/stream (server-side call to AdaL)
      → parses SSE, forwards assistant.message.completed back to browser
  → Browser renders the chat bubble
```

## Model selection

The docs' Quickstart example shows a `model` field at session creation (e.g. `"model": "anthropic-claude-sonnet-4-6"`) — suggesting per-session model choice is supported. No confirmed list of supported models beyond what's in the docs; don't assume availability of a specific model without checking.

## Build order for this layer

1. Create the Agent (system_prompt tailored to "hospital/pharmacy ops assistant", 2-3 custom_tools)
2. Create a Session, provision it
3. Wire the Next.js API route that proxies chat/stream server-side
4. Build the chat widget UI last, once the proxy round-trip works end-to-end with a hardcoded test message
