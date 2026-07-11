# """
# Bayana Analytics custom tools — queried directly from Supabase REST API.
# Uses only stdlib (urllib, json, os) so it works in any Python environment,
# including the AdaL CLI's embedded runtime, without extra pip installs.
# """
# import json
# import os
# import urllib.request
# from adalflow.core.types import ToolOutput

# SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
# SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")


# def _fetch(table: str, org_id: str) -> list:
#     """Hit Supabase REST API for a table, filtered by org_id."""
#     url = f"{SUPABASE_URL}/rest/v1/{table}?org_id=eq.{org_id}"
#     req = urllib.request.Request(
#         url,
#         headers={
#             "apikey": SUPABASE_SERVICE_KEY,
#             "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
#             "Content-Type": "application/json",
#         },
#     )
#     with urllib.request.urlopen(req, timeout=10) as res:
#         return json.loads(res.read())


# def get_stock_levels(org_id: str) -> ToolOutput:
#     """Get current stock levels for all medical supply items in the organization.

#     Args:
#         org_id: The organization's unique identifier.
#     """
#     data = _fetch("stock", org_id)
#     preview = json.dumps(data[:5]) + ("..." if len(data) > 5 else "")
#     return ToolOutput(
#         output=data,
#         observation=f"Retrieved {len(data)} stock items: {preview}",
#         display=f"📦 {len(data)} stock items",
#         status="success",
#     )


# def get_patient_visits(org_id: str) -> ToolOutput:
#     """Get patient visit records for the organization.

#     Args:
#         org_id: The organization's unique identifier.
#     """
#     data = _fetch("visits", org_id)
#     preview = json.dumps(data[:5]) + ("..." if len(data) > 5 else "")
#     return ToolOutput(
#         output=data,
#         observation=f"Retrieved {len(data)} patient visit records: {preview}",
#         display=f"🏥 {len(data)} visits",
#         status="success",
#     )


# def get_revenue(org_id: str) -> ToolOutput:
#     """Get revenue records for the organization.

#     Args:
#         org_id: The organization's unique identifier.
#     """
#     data = _fetch("revenue", org_id)
#     preview = json.dumps(data[:5]) + ("..." if len(data) > 5 else "")
#     return ToolOutput(
#         output=data,
#         observation=f"Retrieved {len(data)} revenue records: {preview}",
#         display=f"💰 {len(data)} revenue records",
#         status="success",
#     )


# # Runtime discovers tools from this list — require_approval=False so agent
# # can call them immediately without human confirmation (read-only Supabase queries).
# CUSTOM_TOOLS = [
#     {"function": get_stock_levels, "require_approval": False},
#     {"function": get_patient_visits, "require_approval": False},
#     {"function": get_revenue, "require_approval": False},
# ]
