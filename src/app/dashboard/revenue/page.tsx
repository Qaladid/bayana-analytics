"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { createClient } from "@/lib/supabase";

type RevenueRow = { branch: string; period: string; amount: number };

export default function RevenuePage() {
  const [rows, setRows] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (!userRow?.org_id) return;

      const { data } = await supabase
        .from("revenue")
        .select("branch, period, amount")
        .eq("org_id", userRow.org_id);

      setRows(
        (data ?? []).map((r) => ({ ...r, amount: Number(r.amount) }))
      );
      setLoading(false);
    }
    fetchRevenue();
  }, []);

  // Pivot into { period, Darusalam_I, Darusalam_II } shape for grouped bars
  const chartData = Object.values(
    rows.reduce((acc: Record<string, any>, row) => {
      acc[row.period] = acc[row.period] || { period: row.period };
      acc[row.period][row.branch] = row.amount;
      return acc;
    }, {})
  );

  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold text-white">Revenue</h1>
        <p className="text-sm text-white/40 mt-1">Facility revenue by branch, over time.</p>
      </motion.div>

      <motion.div variants={fadeUpCard} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
        <p className="text-sm text-white/40">Total Revenue</p>
        <p className="text-3xl font-semibold text-white mt-1">
          {loading ? "—" : `KES ${total.toLocaleString()}`}
        </p>
      </motion.div>

      <motion.div variants={fadeUpCard} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 min-h-[400px]">
        {loading ? (
          <p className="text-white/40 text-sm">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-white/60 text-center py-16">No revenue data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="period" stroke="#ffffff40" fontSize={12} />
              <YAxis stroke="#ffffff40" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff20", borderRadius: 8 }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="Darusalam_I" fill="#0F6E5C" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Darusalam_II" fill="#14B8A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </motion.div>
  );
}