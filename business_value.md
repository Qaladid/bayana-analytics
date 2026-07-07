## Business Value

Nairobi hospital and pharmacy SMEs currently track stock, patient visits, 
and revenue in disconnected Excel files — usually rebuilt by hand every 
month, with no live view across branches and no way to ask a simple 
question ("which branch made more profit this month?") without manually 
digging through spreadsheets. This was validated directly: an earlier 
consulting engagement building a full analytics pipeline for a real 
Nairobi hospital (Excel → Python → PostgreSQL → dbt → Power BI) led to 
referrals to other hospitals — a direct signal that this pain is shared 
across multiple operators, not a one-off.

**Measurable impact this MVP targets:**
- Eliminates manual monthly reformatting/re-entry of Excel data into any 
  reporting tool
- Gives staff a live, cross-branch view of stock, visits, and revenue 
  instead of a static monthly snapshot
- Lets non-technical staff ask direct questions about their own data in 
  plain English instead of building spreadsheet formulas or waiting on 
  someone else to pull a report

**Current scope — Excel-first MVP, HMIS connectors planned next**
This submission is intentionally scoped as an MVP: it ingests the exact 
Excel format hospitals are already using today, since that's the lowest-
friction way to get real data in with zero workflow change for the 
customer. The architecture is built so that Excel is one ingestion path 
among several — the next step is adding direct connectors for the HMIS 
platforms already in use across Nairobi hospitals (e.g. PharmaCore, 
Ilara), so organizations that have moved past Excel can connect directly 
without an export/upload step at all. Excel-first was chosen deliberately 
for this MVP because it requires no integration work from the customer 
and lets the core product (normalization, dashboard, chatbot) be proven 
before investing in connector-specific engineering.