"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { createClient } from "@/lib/supabase";

interface MappingResult {
  field: string;
  detectedColumn?: string;
  confidence: "high" | "medium" | "low" | "none";
}

interface FlaggedColumn {
  columnName: string;
  reason: string;
}

interface PreviewData {
  tableType: "stock_levels" | "patient_visits" | "revenue" | "unknown";
  mappings: MappingResult[];
  flaggedColumns: FlaggedColumn[];
  sampleRows: Record<string, unknown>[];
  allRows: Record<string, unknown>[];
  filename: string;
}

/**
 * Heuristic column matching: returns high/medium/low confidence mapping
 */
function detectColumnMapping(headers: string[]): MappingResult[] {
  const stockKeywords = {
    quantity: ["qty", "stock_qty", "available_units", "quantity_available", "units"],
    item_name: ["item", "product", "item_name", "drug_name", "supply_name"],
    branch: ["location", "facility", "site", "branch"],
  };

  const visitKeywords = {
    visit_date: ["visit_on", "date", "visit_date"],
    count: ["visits", "count", "num_visits", "patient_count"],
    branch: ["location", "facility", "site", "branch"],
  };

  const revenueKeywords = {
    amount: ["revenue", "income", "total", "amount"],
    period: ["month", "period", "date_range"],
    branch: ["location", "facility", "site", "branch"],
  };

  const nameKeywords = ["name", "patient_name", "patient name", "fullname", "full_name"];

  const allMappings: MappingResult[] = [];
  const used = new Set<string>();

  // Collect all possible mappings with scores
  const candidateMappings: Array<{
    field: string;
    column: string;
    confidence: "high" | "medium" | "low";
  }> = [];

  // Check stock keywords
  Object.entries(stockKeywords).forEach(([field, keywords]) => {
    headers.forEach((header) => {
      const lower = header.toLowerCase().trim();
      if (keywords.some((kw) => lower === kw)) {
        candidateMappings.push({ field, column: header, confidence: "high" });
      } else if (keywords.some((kw) => lower.includes(kw))) {
        candidateMappings.push({ field, column: header, confidence: "medium" });
      }
    });
  });

  // Check visit keywords
  Object.entries(visitKeywords).forEach(([field, keywords]) => {
    headers.forEach((header) => {
      const lower = header.toLowerCase().trim();
      if (keywords.some((kw) => lower === kw)) {
        candidateMappings.push({ field, column: header, confidence: "high" });
      } else if (keywords.some((kw) => lower.includes(kw))) {
        candidateMappings.push({ field, column: header, confidence: "medium" });
      }
    });
  });

  // Check revenue keywords
  Object.entries(revenueKeywords).forEach(([field, keywords]) => {
    headers.forEach((header) => {
      const lower = header.toLowerCase().trim();
      if (keywords.some((kw) => lower === kw)) {
        candidateMappings.push({ field, column: header, confidence: "high" });
      } else if (keywords.some((kw) => lower.includes(kw))) {
        candidateMappings.push({ field, column: header, confidence: "medium" });
      }
    });
  });

  // Greedy: pick high-confidence first, then medium, prefer exact matches
  const sortedCandidates = candidateMappings.sort((a, b) => {
    if (a.confidence !== b.confidence) {
      return a.confidence === "high" ? -1 : 1;
    }
    return a.column.localeCompare(b.column);
  });

  const mappedFields = new Set<string>();
  sortedCandidates.forEach(({ field, column, confidence }) => {
    if (!mappedFields.has(field) && !used.has(column)) {
      mappedFields.add(field);
      used.add(column);
      allMappings.push({
        field,
        detectedColumn: column,
        confidence,
      });
    }
  });

  // Add unmapped fields with "none" confidence
  const allFields = [
    ...Object.keys(stockKeywords),
    ...Object.keys(visitKeywords),
    ...Object.keys(revenueKeywords),
  ];
  const uniqueFields = Array.from(new Set(allFields));
  uniqueFields.forEach((field) => {
    if (!mappedFields.has(field)) {
      allMappings.push({
        field,
        detectedColumn: undefined,
        confidence: "none",
      });
    }
  });

  return allMappings;
}

/**
 * Detect which table type based on mapped fields
 */
function detectTableType(
  mappings: MappingResult[]
): "stock_levels" | "patient_visits" | "revenue" | "unknown" {
  const mapped = mappings.filter((m) => m.detectedColumn).map((m) => m.field);

  const stockScore = [
    "quantity",
    "item_name",
    "branch",
  ].filter((f) => mapped.includes(f)).length;
  const visitScore = [
    "visit_date",
    "count",
    "branch",
  ].filter((f) => mapped.includes(f)).length;
  const revenueScore = [
    "amount",
    "period",
    "branch",
  ].filter((f) => mapped.includes(f)).length;

  if (stockScore >= 2) return "stock_levels";
  if (visitScore >= 2) return "patient_visits";
  if (revenueScore >= 2) return "revenue";
  return "unknown";
}

/**
 * Flag columns that look like they contain sensitive data (names)
 */
function flagSensitiveColumns(
  headers: string[],
  used: Set<string>
): FlaggedColumn[] {
  const nameKeywords = [
    "name",
    "patient_name",
    "patient name",
    "fullname",
    "full_name",
    "firstname",
    "first_name",
    "lastname",
    "last_name",
  ];
  const flagged: FlaggedColumn[] = [];

  headers.forEach((header) => {
    if (!used.has(header)) {
      const lower = header.toLowerCase().trim();
      if (nameKeywords.some((kw) => lower.includes(kw))) {
        flagged.push({
          columnName: header,
          reason: "Appears to contain names (PII) — skipped for now",
        });
      }
    }
  });

  return flagged;
}

export default function UploadPage() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get org_id on mount (same pattern as OverviewContent)
  useEffect(() => {
    async function getOrgId() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        return;
      }
      setUserId(user.id);

      const { data: userRow } = await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (userRow?.org_id) {
        setOrgId(userRow.org_id);
      } else {
        setError("Could not determine organization");
      }
    }
    getOrgId();
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccess(false);
      setPreview(null);

      // Parse file with xlsx
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error("No sheets found in file");
      }

      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

      if (rows.length === 0) {
        throw new Error("File is empty");
      }

      const headers = Object.keys(rows[0]);
      const mappings = detectColumnMapping(headers);
      const tableType = detectTableType(mappings);
      const usedColumns = new Set(mappings
        .filter((m) => m.detectedColumn)
        .map((m) => m.detectedColumn!));
      const flaggedColumns = flagSensitiveColumns(headers, usedColumns);

      if (tableType === "unknown") {
        throw new Error(
          "Could not detect table type. Ensure file has recognizable columns for stock, visits, or revenue."
        );
      }

      setPreview({
        tableType,
        mappings,
        flaggedColumns,
        sampleRows: rows.slice(0, 3),
        allRows: rows,
        filename: file.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    }
  }

  async function handleConfirmUpload() {
    if (!preview || !orgId) return;

    try {
      setUploading(true);
      setError(null);

      const supabase = createClient();

      // Create data_source record
      const { data: dataSource, error: dsError } = await supabase
        .from("data_sources")
        .insert({
          org_id: orgId,
          source_type: preview.tableType,
          original_filename: preview.filename,
        })
        .select("id")
        .single();

      if (dsError) {
        throw new Error(`Failed to create data source: ${dsError.message}`);
      }

      const sourceId = dataSource.id;

      // Build column mapping for insert
      const columnMap = new Map<string, string>();
      preview.mappings.forEach((m) => {
        if (m.detectedColumn) {
          columnMap.set(m.field, m.detectedColumn);
        }
      });

      // Insert rows into appropriate table
      if (preview.tableType === "stock_levels") {
        const rowsToInsert = preview.allRows
          .map((row) => ({
            org_id: orgId,
            source_id: sourceId,
            item_name: row[columnMap.get("item_name") || ""] ?? null,
            quantity: row[columnMap.get("quantity") || ""] ?? null,
            branch: row[columnMap.get("branch") || ""] ?? null,
          }))
          .filter((r) => r.item_name && r.quantity);

        if (rowsToInsert.length === 0) {
          throw new Error("No valid rows to insert");
        }

        const { error: insertError } = await supabase
          .from("stock_levels")
          .insert(rowsToInsert);

        if (insertError) {
          throw new Error(`Failed to insert stock levels: ${insertError.message}`);
        }
      } else if (preview.tableType === "patient_visits") {
        const rowsToInsert = preview.allRows
          .map((row) => ({
            org_id: orgId,
            source_id: sourceId,
            visit_date: row[columnMap.get("visit_date") || ""] ?? null,
            count: Number(row[columnMap.get("count") || ""]) || null,
            branch: row[columnMap.get("branch") || ""] ?? null,
          }))
          .filter((r) => r.visit_date && r.count);

        if (rowsToInsert.length === 0) {
          throw new Error("No valid rows to insert");
        }

        const { error: insertError } = await supabase
          .from("patient_visits")
          .insert(rowsToInsert);

        if (insertError) {
          throw new Error(`Failed to insert patient visits: ${insertError.message}`);
        }
      } else if (preview.tableType === "revenue") {
        const rowsToInsert = preview.allRows
          .map((row) => ({
            org_id: orgId,
            source_id: sourceId,
            amount: Number(row[columnMap.get("amount") || ""]) || null,
            period: row[columnMap.get("period") || ""] ?? null,
            branch: row[columnMap.get("branch") || ""] ?? null,
          }))
          .filter((r) => r.amount);

        if (rowsToInsert.length === 0) {
          throw new Error("No valid rows to insert");
        }

        const { error: insertError } = await supabase
          .from("revenue")
          .insert(rowsToInsert);

        if (insertError) {
          throw new Error(`Failed to insert revenue: ${insertError.message}`);
        }
      }

      setSuccess(true);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex flex-col gap-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold text-white">Upload Data</h1>
        <p className="text-sm text-white/40 mt-1">
          Import stock levels, patient visits, or revenue data from Excel or CSV files.
        </p>
      </motion.div>

      {/* Success State */}
      {success && (
        <motion.div
          variants={fadeUpCard}
          className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F6E5C]/10 p-8 flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-[#14B8A6]" />
          </div>
          <p className="text-white/80 text-lg font-medium">Upload successful!</p>
          <p className="text-white/40 text-sm mt-1">
            Your data has been imported and is now visible in the dashboard.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-[23px] bg-[#0F6E5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>
      )}

      {/* Error State */}
      {error && !success && (
        <motion.div
          variants={fadeUpCard}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 text-sm font-medium">Error</p>
            <p className="text-red-200/80 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* File Upload / Preview */}
      {!success && (
        <>
          {!preview ? (
            <motion.div
              variants={fadeUpCard}
              className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8"
            >
              <label className="flex flex-col items-center justify-center cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-[#0F6E5C]/15 flex items-center justify-center mb-4 group-hover:bg-[#0F6E5C]/25 transition">
                  <Upload className="h-8 w-8 text-[#14B8A6]" />
                </div>
                <p className="text-white font-medium">Select a file to upload</p>
                <p className="text-white/40 text-sm mt-1">
                  Supports .xlsx and .csv files (max 10MB)
                </p>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <button className="mt-6 rounded-[23px] bg-[#0F6E5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
                  Choose File
                </button>
              </label>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeUpCard}
              className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Preview: {preview.filename}
              </h3>

              {/* Table Type & Mappings */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-white/40 mb-2">Detected Table Type</p>
                  <p className="text-white font-medium">
                    {preview.tableType === "stock_levels" && "Stock Levels"}
                    {preview.tableType === "patient_visits" && "Patient Visits"}
                    {preview.tableType === "revenue" && "Revenue"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40 mb-2">Column Mappings</p>
                  <div className="space-y-2">
                    {preview.mappings.map((m) => (
                      <div
                        key={m.field}
                        className="flex items-center justify-between text-sm p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-white/60">{m.field}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              m.confidence === "high"
                                ? "bg-[#14B8A6]/30 text-[#14B8A6]"
                                : m.confidence === "medium"
                                ? "bg-yellow-500/30 text-yellow-300"
                                : "bg-white/10 text-white/40"
                            }`}
                          >
                            {m.confidence === "none"
                              ? "not mapped"
                              : m.confidence}
                          </span>
                          {m.detectedColumn && (
                            <span className="text-white/80">{m.detectedColumn}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged Columns */}
                {preview.flaggedColumns.length > 0 && (
                  <div>
                    <p className="text-sm text-white/40 mb-2">Not Imported</p>
                    <div className="space-y-2">
                      {preview.flaggedColumns.map((f) => (
                        <div
                          key={f.columnName}
                          className="flex items-start gap-2 text-sm p-2 bg-yellow-500/10 rounded-lg"
                        >
                          <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-yellow-300 font-medium">
                              {f.columnName}
                            </p>
                            <p className="text-yellow-200/60 text-xs">{f.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Rows */}
              <div className="mb-6">
                <p className="text-sm text-white/40 mb-2">Sample Data</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-white/10">
                        {Object.keys(preview.sampleRows[0] || {}).map((key) => (
                          <th key={key} className="px-2 py-2 text-left text-white/40">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.sampleRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-2 py-2">
                              {String(val ?? "").slice(0, 50)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPreview(null)}
                  disabled={uploading}
                  className="flex-1 rounded-[23px] border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  className="flex-1 rounded-[23px] bg-[#0F6E5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Confirm & Upload"}
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
