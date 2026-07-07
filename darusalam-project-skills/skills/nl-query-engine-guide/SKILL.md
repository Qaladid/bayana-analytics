---
name: nl-query-engine-guide
description: Guide and recipe for building a natural language query engine that translates plain English questions into SQL queries against the Darusalam Hospital dbt mart tables, returning answers in plain English without requiring Metabase access.
---

# NL Query Engine Guide

A lightweight natural language interface over the Darusalam Hospital dbt mart tables. Stakeholders ask questions in plain English and receive plain English answers — no Metabase access required.

---

## Step 0: Architecture Overview

```
Stakeholder types question in plain English
        ↓
Python script sends question + schema context to LLM API
        ↓
LLM returns SQL query
        ↓
Python executes SQL against analytics_analytics schema
        ↓
Python sends result + question back to LLM
        ↓
LLM returns plain English answer
        ↓
Stakeholder gets answer — no Metabase needed
```

The engine is **model-agnostic**: any OpenAI-compatible LLM (OpenAI, Groq, Ollama, etc.) works via environment variables.

---

## Step 1: Schema Context File

Create `schema_context.txt` in the project root. This file is injected into every LLM prompt so it knows the exact table and column names.

```
DATABASE SCHEMA — analytics_analytics

analytics_analytics.mart_profit_trend
- month_year       : the month of the record (e.g. 2025-11-01)
- branch_name      : Darusalam I or Darusalam II
- total_revenue    : total revenue for the month
- total_expenses   : total expenses for the month
- net_profit       : revenue minus expenses
- profit_margin_pct: profit as a percentage of revenue

analytics_analytics.mart_revenue_breakdown
- month_year, branch_name
- revenue sources and payment methods breakdown

analytics_analytics.mart_expense_ratio
- month_year, branch_name
- total_revenue, total_expenses, expense_ratio

analytics_analytics.mart_cash_position
- month_year, branch_name
- closing_cash_balance

analytics_analytics.mart_expense_breakdown
- month_year, branch_name
- expense_category : category name (unpivoted rows)
- amount           : expense amount for that category
```

**Rule**: whenever you add a new column to a mart table, update `schema_context.txt` accordingly so the LLM stays accurate.

---

## Step 2: Core Python Script (`nl_query.py`)

Create `nl_query.py` in the project root:

```python
"""
nl_query.py — Natural Language Query Engine
Usage: python nl_query.py "Your question here"
"""

import os
import sys
import psycopg2
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# --- Config ---
DB_CONN = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     os.getenv("DB_PORT", 5432),
    "dbname":   os.getenv("DB_NAME", "darusalam_db"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}
LLM_API_KEY  = os.getenv("LLM_API_KEY")
LLM_MODEL    = os.getenv("LLM_MODEL", "gpt-4o-mini")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")

SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "schema_context.txt")


def load_schema() -> str:
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        return f.read()


def ask_llm_for_sql(client: OpenAI, schema: str, question: str) -> str:
    system_prompt = (
        "You are a SQL expert. Given the schema below, write a single "
        "PostgreSQL SELECT query that answers the user's question. "
        "Return ONLY the SQL — no explanation, no markdown fences.\n\n"
        f"{schema}"
    )
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system",  "content": system_prompt},
            {"role": "user",    "content": question},
        ],
        temperature=0,
    )
    return response.choices[0].message.content.strip()


def run_sql(sql: str) -> list[dict]:
    conn = psycopg2.connect(**DB_CONN)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()
    return rows


def ask_llm_for_answer(client: OpenAI, question: str, rows: list[dict]) -> str:
    system_prompt = (
        "You are a helpful hospital finance assistant. "
        "Given a user question and raw SQL query results, "
        "answer the question in plain English. Be concise and specific."
    )
    user_message = (
        f"Question: {question}\n\n"
        f"Query results (JSON):\n{rows}"
    )
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


def main():
    if len(sys.argv) < 2:
        print("Usage: python nl_query.py \"Your question here\"")
        sys.exit(1)

    question = sys.argv[1]
    schema   = load_schema()
    client   = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)

    print(f"\n🔍 Question: {question}")

    sql = ask_llm_for_sql(client, schema, question)
    print(f"\n📝 Generated SQL:\n{sql}")

    rows = run_sql(sql)
    print(f"\n📊 Raw rows returned: {len(rows)}")

    answer = ask_llm_for_answer(client, question, rows)
    print(f"\n✅ Answer:\n{answer}\n")


if __name__ == "__main__":
    main()
```

> **Note**: This file is described here for reference. Do not create it until the team decides to implement the feature — this SKILL.md is the planning guide only.

---

## Step 3: Environment Variables

Add to `.env` and `.env.example`:

```env
# NL Query Engine
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
```

Compatible providers (just change `LLM_BASE_URL` and `LLM_MODEL`):

| Provider | LLM_BASE_URL                          | Example Model       |
|----------|---------------------------------------|---------------------|
| OpenAI   | https://api.openai.com/v1             | gpt-4o-mini         |
| Groq     | https://api.groq.com/openai/v1        | llama3-70b-8192     |
| Ollama   | http://localhost:11434/v1             | llama3              |

---

## Step 4: Example Questions the Engine Must Answer

```
"Which branch made more profit in November?"
"What is Darusalam II profit margin?"
"What were the biggest expenses last month?"
"Compare revenue between both branches"
"Is our cash position healthy?"
```

Test each question after setup to verify the SQL generated is correct.

---

## Step 5: Running the Engine

```bash
python nl_query.py "Which branch was more profitable in November 2025?"
```

Expected output flow:
1. Question echoed
2. SQL printed (inspect for correctness)
3. Number of rows returned
4. Plain English answer printed

---

## Step 6: Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SQL error: column "xyz" does not exist` | LLM hallucinated a wrong column name | Add more detail to `schema_context.txt` — include exact column names |
| `No data returned` | Mart tables are empty | Run `dbt run` first; verify data loaded with `python scripts/load_to_postgres.py` |
| `API error / 401` | Invalid or missing API key | Check `LLM_API_KEY` in `.env` |
| `Connection refused` | PostgreSQL not running | Start Docker: `docker-compose up -d` |
| Answer is vague | LLM summarised too broadly | Reduce `temperature` in `ask_llm_for_answer` to `0` |

---

## Step 7: Streamlit GUI (Stakeholder Interface)

### Architecture

```
Stakeholder opens browser at http://localhost:8501
        ↓
Types question in text input box
        ↓
Streamlit calls nl_query.py logic
        ↓
Answer displayed in plain English on screen
```

### Installation

```bash
pip install streamlit
```

Add `streamlit` to `requirements.txt`.

### Create: `streamlit_app.py` in project root

```python
"""
streamlit_app.py — Darusalam Hospital NL Query GUI
Usage: streamlit run streamlit_app.py
"""

import streamlit as st
from nl_query import load_schema, ask_llm_for_sql, run_sql, ask_llm_for_answer
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("LLM_API_KEY"),
    base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
)
schema = load_schema()

st.title("🏥 Darusalam Hospital Analytics")
st.caption("Ask a question about your data in plain English.")

EXAMPLE_QUESTIONS = [
    "Which branch made more profit in November?",
    "What were the biggest expenses last month?",
    "Compare revenue between both branches",
    "Is our cash position healthy?",
]

st.markdown("**Example questions:**")
cols = st.columns(len(EXAMPLE_QUESTIONS))
selected = None
for i, q in enumerate(EXAMPLE_QUESTIONS):
    if cols[i].button(q, key=f"ex_{i}"):
        selected = q

question = st.text_input("Ask a question about your data...", value=selected or "")

if st.button("Ask") and question:
    with st.spinner("Thinking..."):
        try:
            sql  = ask_llm_for_sql(client, schema, question)
            rows = run_sql(sql)
            answer = ask_llm_for_answer(client, question, rows)
            st.info(answer)
            with st.expander("Show generated SQL"):
                st.code(sql, language="sql")
        except Exception as e:
            st.error(f"Error: {e}")
```

> **Note**: This file is described here for reference. Do not create it until the team decides to implement the feature — this SKILL.md is the planning guide only.

### Running the App

```bash
streamlit run streamlit_app.py
# Opens at http://localhost:8501
```

### Deploying to Railway (for remote access)

1. Add `streamlit_app.py` to GitHub (commit and push).
2. Create a new Railway service pointing to the repository.
3. Set the start command:
   ```
   streamlit run streamlit_app.py --server.port $PORT --server.address 0.0.0.0
   ```
4. Add the same environment variables (`LLM_API_KEY`, `LLM_MODEL`, `LLM_BASE_URL`, `DB_*`) in Railway's variable settings.
5. Hospital owner accesses the app from any browser — no local installation required.
