"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { createClient } from "@/lib/supabase";

type StockRow = {
  id: string;
  item_name: string;
  quantity: number;
  branch: string;
  recorded_at: string;
};

export default function StockPage() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
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
        .from("stock_levels")
        .select("id, item_name, quantity, branch, recorded_at")
        .eq("org_id", userRow.org_id)
        .order("quantity", { ascending: true });

      setRows(data ?? []);
      setLoading(false);
    }
    fetchStock();
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold text-white">Stock Levels</h1>
        <p className="text-sm text-white/40 mt-1">Current inventory across all branches.</p>
      </motion.div>

      <motion.div variants={fadeUpCard} className="rounded-2xl border border-white/10 bg-[#1A1A1A] overflow-hidden">
        {loading ? (
          <p className="text-white/40 p-6 text-sm">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-8 w-8 text-[#14B8A6] mb-3" />
            <p className="text-white/60">No stock data yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-left">
                <th className="px-6 py-3 font-medium">Item</th>
                <th className="px-6 py-3 font-medium">Branch</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Recorded</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 text-white">
                  <td className="px-6 py-4">{row.item_name}</td>
                  <td className="px-6 py-4 text-white/60">{row.branch}</td>
                  <td className={`px-6 py-4 font-medium ${row.quantity < 10 ? "text-red-400" : "text-white"}`}>
                    {row.quantity}
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {new Date(row.recorded_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}