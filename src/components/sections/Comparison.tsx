"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";
import { X, Check } from "lucide-react";

const otherTools = [
  "Messy Excel exports, manual re-entry every month",
  "No real-time visibility, stale monthly reports",
  "No cross-branch visibility, siloed data",
  "No way to ask questions of your data",
  "Stockouts caught too late, reactive ordering",
];

const clario = [
  "Smart dashboard, real-time updates",
  "Simple, transparent pricing",
  "Automated reports & low-stock alerts",
  "Team-friendly, syncs branches easily",
  "Priority support, fast response",
];

export default function Comparison() {
  return (
    <section className="py-[60px] md:py-[120px] px-5 md:px-10">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-clario-accent text-sm font-medium uppercase tracking-widest mb-4">
            Why Bayana?
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            There&rsquo;s a smarter way to manage hospital data
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <motion.div variants={fadeUp} className="rounded-[30px] p-8 bg-[#0d0d0d] border border-[#1a1a1a]">
            <h3 className="text-white/40 font-semibold text-lg mb-6">Other Tools</h3>
            <div className="space-y-4">
              {otherTools.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1f1f1f] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="h-3 w-3 text-white/30" />
                  </div>
                  <span className="text-white/40 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-[30px] p-8 bg-clario-accent/5 border border-clario-accent/20">
            <h3 className="text-clario-accent font-semibold text-lg mb-6">Bayana</h3>
            <div className="space-y-4">
              {clario.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-clario-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-clario-accent" />
                  </div>
                  <span className="text-white text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}