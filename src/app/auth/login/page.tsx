"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Users, DollarSign, FileSpreadsheet } from "lucide-react";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { createClient } from "@/lib/supabase";

export default function OverviewContent() {
  const [stockCount, setStockCount] = useState<number | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [revenueTotal, setRevenueTotal] = useState<number | null>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    async function fetchKPIs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (!userRow?.org_id) return;
      const orgId = userRow.org_id;

      const { count: stock } = await supabase
        .from("stock_levels")
        .select("*", { count: "exact", head: true })
        .eq("org_id", orgId);

      const { count: visits } = await supabase
        .from("patient_visits")
        .select("*", { count: "exact", head: true })
        .eq("org_id", orgId);

      const { data: revenueRows } = await supabase
        .from("revenue")
        .select("amount")
        .eq("org_id", orgId);

      const revenueSum = (revenueRows ?? []).reduce(
        (sum, row) => sum + Number(row.amount),
        0
      );

      setStockCount(stock ?? 0);
      setVisitCount(visits ?? 0);
      setRevenueTotal(revenueSum);
      setHasData((stock ?? 0) > 0 || (visits ?? 0) > 0 || revenueSum > 0);
    }
    fetchKPIs();
  }, []);

  const kpis = [
    { label: "Stock Items", value: stockCount, icon: Package, format: (v: number) => v.toLocaleString() },
    { label: "Patient Visits", value: visitCount, icon: Users, format: (v: number) => v.toLocaleString() },
    { label: "Revenue", value: revenueTotal, icon: DollarSign, format: (v: number) => `KES ${v.toLocaleString()}` },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-white/40 mt-1">
          Your hospital data at a glance.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={fadeUpCard}
            className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/40">{kpi.label}</p>
              <div className="w-10 h-10 rounded-xl bg-[#0F6E5C]/15 flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-[#14B8A6]" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-white">
              {kpi.value === null ? "—" : kpi.format(kpi.value)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {!hasData && (
        <motion.div
          variants={fadeUpCard}
          className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-[#0F6E5C]/10 flex items-center justify-center mb-4">
            <FileSpreadsheet className="h-8 w-8 text-[#14B8A6]" />
          </div>
          <p className="text-white/60 text-lg font-medium">No data yet</p>
          <p className="text-white/40 text-sm mt-1">
            Upload an Excel file to get started
          </p>
          <Link
            href="/dashboard/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-[23px] bg-[#0F6E5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Upload Data
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}