# Team Allocation — Clario → Bayana Analytics Clone (Phase A fix round + Phase B)

| Worker ID | Alias | Role | Mode | Model | Status | Session ID |
|-----------|-------|------|------|-------|--------|------------|
| adal-worker-51ec14da | builder | Builder (visual) | browser-use | anthropic-claude-opus-4-6 | active | 0c862c05-19cc-45dc-b098-cb7796f18ce2 |
| adal-worker-74ee6f61 | evaluator | Evaluator (visual) | browser-use | google-gemini-3.5-flash | active | cfbd40d4-3281-4c72-b745-a82ba22d357b |

## Task Context
- Goal: Finish Phase A (structural clone of live Clario) to ACCEPT, then Phase B (teal/blue + Bayana copy + hospital mockups).
- Last state: Evaluator REJECTED Phase A (eval_round_1.md) — 3 BLOCKERs (pixel diff all viewports, step cards 27% short), 5 MAJORs (hero h1 216px low, page 19% short, buttons too narrow), 2 MINORs.
- New bug this round: scroll animations use `viewport={{once:true}}` — must become `once:false` so fades REPLAY on every re-entry (live Clario behavior). Permanent test case added.
- Contract: team-log/contract.md (A5 updated with repeat-trigger requirement)
- Test plan: team-log/test_plan.md (§2.5 added — repeat-trigger scroll test, permanent)
- Builder progress: builder session transcript
- Eval reports: team-log/eval_round_N.md
