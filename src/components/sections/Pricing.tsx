"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    desc: "Perfect for freelancers who want full control over their personal finances.",
    features: ["Track income & expenses", "Connect up to 2 accounts", "Monthly reports", "Smart alerts"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "Advanced tools to manage your money smarter and unlock powerful insights.",
    features: ["Unlimited accounts", "AI spending insights", "Custom alerts", "Advanced reporting"],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-[60px] md:py-[100px] px-5 md:px-10">
      <div className="max-w-[1199px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-clario-accent text-sm font-medium uppercase tracking-widest mb-4">
            Pricing
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium mb-4"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            Simple plans.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/50 text-lg max-w-[500px] mx-auto">
            Straightforward pricing with no hidden costs. Everything you need to manage your money better.
          </motion.p>

          {/* Toggle (decorative — mirrors Clario's non-functional toggle) */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-1 p-1 rounded-full bg-[#0d0d0d] border border-[#1a1a1a] mt-6">
            <span className="px-4 py-1.5 rounded-full bg-clario-accent text-[#0d0d0d] text-sm font-semibold">Monthly</span>
            <span className="px-4 py-1.5 text-white/40 text-sm font-medium">Yearly</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUpCard}
              className="relative rounded-[30px] p-6 md:p-14"
              style={{
                background: "#0d0d0d",
                boxShadow: tier.popular
                  ? "inset 0px 1px 0px 0px rgba(140,255,47,0.15), inset 0px -1px 0px 0px rgba(140,255,47,0.15), 0px 1px 2px 0px rgba(140,255,47,0.4), 0px 3px 8px 0px rgba(140,255,47,0.19), 0px 6px 4px 0px rgba(140,255,47,0.05)"
                  : "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05)",
              }}
            >
              {tier.popular && (
                <span
                  className="absolute top-0 right-0 px-4 py-2 text-xs font-semibold"
                  style={{ background: "#171717", color: "#0d0d0d", borderRadius: "0px 16px 0px 30px" }}
                >
                  POPULAR
                </span>
              )}
              <h3 className="text-white font-semibold text-lg mb-4">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-white font-medium" style={{ fontSize: "48px", letterSpacing: "-1.92px" }}>
                  {tier.price}
                </span>
                <span className="text-white/40 text-sm">{tier.period}</span>
              </div>
              <p className="text-white/50 text-sm mb-10">{tier.desc}</p>
              <div className="space-y-6">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-clario-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-clario-accent" />
                    </div>
                    <span className="text-white/80 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team strip */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="mt-16 max-w-[800px] mx-auto"
        >
          <motion.div
            variants={fadeUpCard}
            className="rounded-[30px] p-6 md:p-14 text-center"
            style={{
              background: "#0d0d0d",
              boxShadow: "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05)",
            }}
          >
            <h3 className="text-white font-semibold text-xl mb-2">Trusted by teams worldwide</h3>
            <p className="text-white/50 text-sm">Invite your team, sync accounts in real time, and track shared goals with ease.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
