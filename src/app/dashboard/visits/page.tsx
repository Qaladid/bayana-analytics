"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { createClient } from "@/lib/supabase";

type VisitSummary = { branch: string; total: number };

export default function VisitsPage() {
  const [summary, setSummary] = useState<VisitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVisits() {
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
        .from("patient_visits")
        .select("branch, count")
        .eq("org_id", userRow.org_id);

      const grouped: Record<string, number> = {};
      (data ?? []).forEach((row) => {
        grouped[row.branch] = (grouped[row.branch] ?? 0) + row.count;
      });

      setSummary(Object.entries(grouped).map(([branch, total]) => ({ branch, total })));
      setLoading(false);
    }
    fetchVisits();
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold text-white">Patient Visits</h1>
        <p className="text-sm text-white/40 mt-1">Total visits by branch.</p>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-white/40 text-sm">Loading...</p>
        ) : summary.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-white/10 bg-[#1A1A1A] flex flex-col items-center justify-center py-16">
            <Users className="h-8 w-8 text-[#14B8A6] mb-3" />
            <p className="text-white/60">No visit data yet.</p>
          </div>
        ) : (
          summary.map((row) => (
            <motion.div
              key={row.branch}
              variants={fadeUpCard}
              className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6"
            >
              <p className="text-sm text-white/40 mb-2">{row.branch}</p>
              <p className="text-3xl font-semibold text-white">{row.total.toLocaleString()}</p>
              <p className="text-xs text-white/30 mt-1">total visits</p>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}