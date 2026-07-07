# Bayana AI Service

FastAPI microservice wrapping the AdaL Agent SDK. Exposes a single `POST /chat` endpoint that the Next.js app proxies to.

## Local dev

```bash
cd python-service
pip install -r requirements.txt
# AdaL CLI must be installed: curl -fsSL https://adal.sylph.ai/install.sh | bash

SUPABASE_URL=... SUPABASE_SERVICE_KEY=... ADAL_AUTH_TOKEN=... uvicorn main:app --reload
```

Test with curl:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"org_id": "your-org-id", "message": "How many patients visited last month?"}'
```

## Deploy to Render

1. Push this repo to GitHub (the `python-service/` folder can live in the same repo).
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo, set **Root Directory** to `python-service`.
4. Render will detect the `Dockerfile` automatically.
5. Add these environment variables in the Render dashboard:
   - `SUPABASE_URL` — your Supabase project URL (e.g. `https://xxxx.supabase.co`)
   - `SUPABASE_SERVICE_KEY` — your Supabase service role key (bypasses RLS)
   - `ADAL_AUTH_TOKEN` — the `access_token` value from your `ADAL_JWT` / `~/.adal/adal_oauth_creds.json`
6. Deploy. Once live, copy the service URL (e.g. `https://bayana-ai-service.onrender.com`).
7. Add `CHAT_SERVICE_URL=https://bayana-ai-service.onrender.com` to your Vercel environment variables.
8. Redeploy the Next.js app on Vercel.

## Architecture

```
Browser
  → ChatWidget (no changes)
    → POST /api/chat  (Next.js / Vercel — thin proxy, resolves org_id server-side)
      → POST /chat    (this FastAPI service on Render)
        → AdaL SDK query()  →  .adal/tools.py  →  Supabase REST API
```

## Env vars summary

| Variable | Where set | Purpose |
|---|---|---|
| `SUPABASE_URL` | Render | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Render | Service role key for direct DB access |
| `ADAL_AUTH_TOKEN` | Render | AdaL JWT for SDK auth (headless/CI mode) |
| `CHAT_SERVICE_URL` | Vercel | URL of this Render service |
