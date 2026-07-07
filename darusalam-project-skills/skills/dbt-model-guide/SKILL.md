---
name: dbt-model-guide
description: Guide and recipe for managing and controlling dbt models in the Darusalam Hospital analytics pipeline, including dependency analysis, transformation execution, and documentation generation.
---

# DBT Model Control Skill

Guide: Data Pipeline Management Recipe for Hospital Analytics

When building a robust data analytics pipeline for hospital operations, the biggest trap is managing complex dbt model dependencies manually. Modern data warehouses generate intricate lineage graphs and transformation chains that require systematic control.

The Golden Rule: Trust your "data flow" (lineage) first, but when transformations look too complex to be pure SQL, use deep model interrogation to extract the exact logic.

---

## Architecture Overview

This project uses **DuckDB** as the local data warehouse — a serverless, single-file database at `darusalam.duckdb` in the project root. dbt connects to it via the `dbt-duckdb` adapter. No Docker, no PostgreSQL, no infrastructure required.

**dbt profile** (`~/.dbt/profiles.yml`):
```yaml
darusalam_dbt:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: C:/Projects/darusalam-hospital/darusalam.duckdb
      threads: 4
```

**DuckDB schema layout after `dbt run`:**
- `main` — raw tables (raw_daily_sales, raw_purchases, raw_monthly_summary)
- `main_staging` — dbt staging views
- `main_analytics` — dbt mart tables (5 tables, the source of truth for Power BI)

---

## The 80/20 Pipeline Philosophy

**The 80% Sprint (Structure & Dependencies):** Establish the model relationships rapidly. Use Steps 0-2 to analyze the DAG, scaffold the transformation layers (staging → marts), and apply basic configurations.

**The 20% Polish (Optimization & Validation):** Once the 80% structure is running, shift to meticulous engineering. Use Steps 3-5 to optimize queries, implement advanced tests, and ensure data quality.

---

## The 6-Step "Data-First" Recipe

### Step 0: Project Scaffolding Strategy

Before writing models, establish a scalable dbt project structure.

```
models/staging/   — Raw data cleaning and standardization
models/marts/     — Business logic and KPIs
models/intermediate/ — Complex transformations between layers
tests/            — Data quality validations
macros/           — Reusable SQL functions
```

### Step 1: The "Data Test" (Quality Grounding)

Before writing a single line of SQL, ground yourself in the source data.

- **Sources**: What are the raw table structures? Data types? Null patterns?
- **Transformations**: Which business rules need implementation?
- **Outputs**: What KPIs and metrics are required?

### Step 2: Macro Structure Capture (Schema Analysis)

Analyze the dbt project structure to understand the staging → marts flow.
Map out the DAG (Directed Acyclic Graph) of model dependencies.

```bash
cd darusalam_dbt
dbt ls                    # List all models
dbt run --select staging  # Run only staging layer
dbt run --select marts    # Run only mart layer
```

### Step 3: Micro Extraction (Model Analysis)

Focus on targeted analysis of specific models. Do NOT query full model files blindly.

**Verify DuckDB connection:**
```bash
dbt debug
```

**Query DuckDB directly to inspect mart output:**
```python
import duckdb
conn = duckdb.connect("darusalam.duckdb")
print(conn.execute("SELECT * FROM main_analytics.mart_profit_trend LIMIT 5").df())
```

### Step 4: Deep Model Interrogation

When a transformation looks complex, analyze the query plan in DuckDB:

```sql
EXPLAIN SELECT * FROM main_analytics.mart_expense_breakdown;
```

Check test coverage:
```bash
dbt test
dbt test --select mart_profit_trend
```

### Step 5: Synthesis & Optimization

- **Build the Base (80%)**: Scaffold the structure using Step 2
- **Apply Logic (20%)**: Implement the exact business rules
- **Performance**: DuckDB is columnar and very fast locally — standard materializations are sufficient for this scale

---

## Running the Full Pipeline

```bash
# 1. Load raw data into DuckDB
python setup_database.py --load

# 2. Run all dbt models
cd darusalam_dbt
dbt run

# 3. Test data quality
dbt test

# 4. Generate documentation
dbt docs generate
dbt docs serve
```

---

## Troubleshooting & Best Practices

- **"Model is slow"** → DuckDB is columnar and fast; check if the CSV was loaded correctly first
- **"Data doesn't match expectations"** → Check upstream staging models and source CSV quality
- **"Tests are failing"** → Review test logic and ensure `dbt run` completed without errors
- **"Schema not found"** → Ensure `dbt run` has been executed — DuckDB schemas are created on first run

**Save Artifacts**: Always version control your dbt project.  
**Documentation**: Maintain up-to-date model and column descriptions in `schema.yml`.

---

## Ethical/Legal Note

When working with healthcare data, ensure data privacy and confidentiality. Focus on analytics that improve patient care and operational efficiency. The `darusalam.duckdb` file contains sensitive financial data — keep it out of version control (add to `.gitignore`).
