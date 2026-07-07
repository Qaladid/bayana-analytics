---
name: excel-pipeline-guide
description: Guide and recipe for running the monthly Excel ingestion pipeline for Darusalam Hospital — from raw Excel file to DuckDB raw tables ready for dbt.
---

# Excel Pipeline Skill

Guide: Monthly Excel Ingestion Recipe for Hospital Analytics

When running the monthly data pipeline for Darusalam Hospital, the biggest trap is skipping verification steps — loading bad data or running dbt before the raw tables are populated. Follow each step in order.

The Golden Rule: Verify before you proceed. Each step has a clear success signal — don't move forward until you see it.

---

## Architecture Overview

This project uses **DuckDB** as the local data warehouse — a serverless, single-file database requiring zero infrastructure. All data lives in `darusalam.duckdb` in the project root. No Docker, no PostgreSQL, no containers needed.

---

## Step 1: Place Excel File in `input/` Folder

Copy the accountant's Excel file into the `input/` directory.

**Naming convention:**
```
MONTH_RECORD.XLSX
```

Examples:
- `DECEMBER_RECORD.XLSX`
- `JANUARY_RECORD.XLSX`
- `NOVEMBER_RECORD.XLSX`

> The pipeline extracts the month name from the filename — exact naming matters.

---

## Step 2: Run the Cleaning Pipeline

```bash
python darusalam_pipeline.py input/DECEMBER_RECORD.XLSX
```

**Expected output:** 7 CSV files generated under `output/DECEMBER/`:

```
output/DECEMBER/
├── clean_DECEMBER_branch1_daily.csv
├── clean_DECEMBER_branch1_purchases.csv
├── clean_DECEMBER_branch1_monthly_summary.csv
├── clean_DECEMBER_branch2_daily.csv
├── clean_DECEMBER_branch2_purchases.csv
├── clean_DECEMBER_branch2_monthly_summary.csv
└── clean_DECEMBER_combined_daily.csv
```

If the 7 files are present, proceed to Step 3.

---

## Step 3: Load CSVs into DuckDB

```bash
python setup_database.py --load
```

This loads all CSVs from `output/` into the three raw tables inside `darusalam.duckdb`:

| Table | Source |
|---|---|
| `raw_daily_sales` | `*_daily.csv` + `*_combined_daily.csv` |
| `raw_purchases` | `*_purchases.csv` |
| `raw_monthly_summary` | `*_monthly_summary.csv` |

> **Idempotent** — safe to re-run. Existing rows for the same month/branch are skipped, not duplicated.

> First time only: run `python setup_database.py --setup` to create the tables.

---

## Step 4: Verify Row Counts

Query DuckDB directly to confirm the data loaded correctly:

```python
import duckdb
conn = duckdb.connect("darusalam.duckdb")
print(conn.execute("""
    SELECT source_month, branch_name, COUNT(*) AS row_count
    FROM raw_daily_sales
    GROUP BY source_month, branch_name
    ORDER BY source_month, branch_name
""").df())
```

Or use the DuckDB CLI:
```bash
duckdb darusalam.duckdb "SELECT branch, month, COUNT(*) FROM raw_daily_sales GROUP BY branch, month"
```

**Expected:** ~30 rows per branch per month (one row per day of trading).

---

## Step 5: Run dbt Transformations

From the `darusalam_dbt/` directory:

```bash
cd darusalam_dbt
dbt run
dbt test
```

`dbt run` rebuilds all 5 mart tables inside `darusalam.duckdb` from the updated raw data.
`dbt test` validates data quality — all tests should pass.

---

## Step 6: Open Power BI Dashboard

Open the `.pbip` file in Power BI Desktop. The dashboard reads directly from `darusalam.duckdb` via the DuckDB connector. Refresh the report to see the new month's data.

---

## Troubleshooting

| Error | Likely Cause | Fix |
|---|---|---|
| `"Sheet not found"` | Excel sheet names don't match expected | Open the Excel file and verify sheet names |
| `"0 rows loaded"` | CSVs not generated or wrong path | Check `output/MONTH/` folder exists and has 7 files |
| `dbt run` fails | Connection or model error | Run `dbt debug` first to test the DuckDB connection |
| `darusalam.duckdb not found` | setup not run | Run `python setup_database.py --setup` first |
| Duplicate data | `--load` run twice with same data | Data is idempotent — existing rows are skipped automatically |

---

## Quick Reference (Full Monthly Run)

```bash
# 1. Place Excel in input/ (manual step)

# 2. Clean Excel → CSVs
python darusalam_pipeline.py input/DECEMBER_RECORD.XLSX

# 3. Load CSVs → DuckDB
python setup_database.py --load

# 4. Transform with dbt
cd darusalam_dbt
dbt run
dbt test

# 5. Refresh Power BI Desktop report
```
