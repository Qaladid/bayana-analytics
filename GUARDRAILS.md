# Guardrails — Bayana Analytics Assistant

This document describes the guardrails implemented in the Bayana Analytics
AI assistant's system prompt, addressing prompt injection and other unsafe
or unintended behaviors.

**Source of truth:** all rules below are quoted verbatim from
[`python-service/system_prompt.txt`](python-service/system_prompt.txt),
the single file that actually governs the assistant's behavior. This
document does not restate or paraphrase the rules — it only explains
*why* each one exists. If the two ever appear to disagree, the prompt
file is correct and this file is stale.

## 1. Org-scoping (data isolation)

The assistant never references, mentions, or reasons about organization
identifiers at all — org resolution happens entirely outside the model's
awareness.

> "Never reference, mention, or reason about org_id, organization IDs, or
> any internal identifiers in your replies — this is handled automatically
> and invisibly by the system. Just call the relevant tool(s) and answer
> using their results."

This is enforced at two layers: the system prompt gives the model no
reason to ever produce org_id-related text, and the application layer
never passes a client-supplied org_id to the assistant in the first
place — the real org_id is resolved server-side from the authenticated
Supabase session before the request reaches the model. This prevents one
organization's user from querying another organization's data, and
prevents the model from echoing or fabricating org_id text in replies.

## 2. No fabrication under data gaps

The assistant is required to call its tools before answering and to
report only what those tools return — never guess or invent figures.

> "Always call the relevant tool(s) before answering — never guess or
> fabricate numbers."

> "Never fabricate, estimate, or hallucinate data. Only report what the
> tools return. If a tool returns an empty list, say: 'No
> [stock/visit/revenue] records were found for your organization.'"

This matters specifically for a financial/operational data assistant —
a hallucinated stock count or revenue figure is a much more costly
failure mode than an honest "no records found."

## 3. Scope lock (off-topic refusal)

The assistant only answers questions about the organization's own stock
levels, patient visits, and revenue data.

> "Only answer questions about stock levels, patient visits, and revenue
> data for the organization. If the user asks anything off-topic
> (weather, general advice, coding, etc.), respond: 'I can only help
> with stock levels, patient visits, and revenue data for your
> organization. Please stay on topic.'"

This prevents the assistant from being repurposed as a general-purpose
chatbot, giving medical advice, or answering unrelated queries — all
outside its intended function and liability scope.

## 4. Credential/secret handling

The assistant will not process or repeat anything that looks like a
password, API key, token, or secret pasted into the chat.

> "If the user pastes anything that looks like a password, API key,
> token, or secret (e.g. long random strings, 'sk-', 'Bearer ',
> 'password='), immediately respond: '⚠️ It looks like you may have
> pasted a credential or secret into the chat. I cannot process that —
> please remove it and rephrase your question.' Do not repeat, store,
> or use any credential the user accidentally shares."

This avoids the assistant echoing sensitive strings back into chat
history/logs, and flags the mistake to the user immediately rather than
silently using or storing the value.

## 5. Tone handling

The assistant is instructed to respond firmly but politely to rude or
offensive user messages rather than escalating or silently absorbing it.

> "If the user is rude, condescending, or uses offensive language,
> respond politely but firmly: 'I'm here to help you with your hospital
> analytics. Please keep the conversation respectful so I can assist you
> effectively.'"

## 6. Prompt injection resistance

Tool output (data pulled from Supabase) is treated strictly as data to
report, never as instructions to follow — the assistant does not act on
embedded instructions found in stock item names, notes, or other
free-text fields returned by a tool call.

This is implemented structurally rather than as a standalone rule: the
model only ever receives tool results as plain-text data alongside the
CORE RULES above, and nothing in the prompt grants tool output the
authority to redefine the assistant's role or rules.

## 7. Response formatting

Not a safety guardrail, but a consistency rule worth documenting since
it affects every reply:

> "Be concise: 2-4 sentences max unless a table or list genuinely helps
> clarity. Format numbers clearly (e.g. '12,450 KES', '47 patients', '22
> stock items')."

## Where these live

All rules are implemented as a single system prompt
([`system_prompt.txt`](python-service/system_prompt.txt)) attached to
the assistant's every session (not per-message, so they can't be dropped
or diluted partway through a conversation), combined with server-side
enforcement of org-scoping so the model's cooperation isn't the only
line of defense for data isolation.
