"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { Play } from "lucide-react";

const steps = [
  {
    n: "Step 1",
    title: "Connect your accounts",
    desc: "Sync all your bank accounts, credit cards, and wallets — securely and instantly.",
    mockup: "card",
  },
  {
    n: "Step 2",
    title: "Track your money",
    desc: "See where your money goes with real-time spending insights and clear breakdowns.",
    mockup: "chart",
  },
  {
    n: "Step 3",
    title: "Set goals & stay on track",
    desc: "Plan your savings, set monthly budgets, and let Clario keep you in control.",
    mockup: "progress",
  },
];

function StepMockup({ type }: { type: string }) {
  if (type === "card") {
    return (
      <div className="w-full h-[220px] md:h-[340px] rounded-2xl p-5 bg-gradient-to-br from-[#1a2e05] to-[#0d0d0d] border border-[#2a3f10]">
        <div className="flex justify-between items-start mb-20">
          <span className="text-clario-accent text-xs font-semibold">CREDIT</span>
          <div className="w-8 h-6 rounded bg-[#0d0d0d]/50" />
        </div>
        <p className="text-white text-2xl font-semibold">$430,000</p>
        <p className="text-white/30 text-xs mt-1">•••• 4242</p>
      </div>
    );
  }
  if (type === "chart") {
    return (
      <div className="w-full h-[220px] md:h-[340px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f]">
        <div className="flex justify-between mb-4">
          <p className="text-white text-sm font-semibold">Balance</p>
          <p className="text-white/40 text-xs">Last 8 Months</p>
        </div>
        <svg viewBox="0 0 280 220" className="w-full h-[220px]">
          <polyline
            points="0,180 40,160 80,170 120,140 160,150 200,120 240,130 280,100"
            fill="none"
            stroke="#8cff2e"
            strokeWidth="2"
          />
          <circle cx="280" cy="100" r="4" fill="#8cff2e" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-full h-[220px] md:h-[340px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f] flex flex-col justify-center">
      <p className="text-white/40 text-xs mb-2">Daily Limit</p>
      <p className="text-white text-lg font-semibold mb-4">$2,500.00</p>
      <div className="w-full h-2 rounded-full bg-[#0d0d0d]">
        <div className="h-full rounded-full bg-clario-accent" style={{ width: "12.5%" }} />
      </div>
      <p className="text-clario-accent text-xs mt-2 font-medium">12.5% used</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[60px] md:py-[100px] px-5 md:px-10">
      <div className="max-w-[1199px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.a
            variants={fadeUp}
            href="#"
            className="inline-flex items-center gap-2 text-clario-accent text-sm font-medium mb-4 hover:underline"
          >
            <Play className="h-4 w-4 fill-clario-accent" /> Watch video
          </motion.a>
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            How Clario works
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center"
        >
          {steps.map((step) => (
            <motion.div
              key={step.n}
              variants={fadeUpCard}
              className="w-full max-w-[320px] rounded-[30px] p-2.5 pb-[30px]"
              style={{
                background: "#0d0d0d",
                boxShadow:
                  "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)",
              }}
            >
              <StepMockup type={step.mockup} />
              <div className="px-3 pt-5">
                <p
                  className="text-clario-accent font-medium mb-2"
                  style={{ fontSize: "16px", letterSpacing: "-0.32px" }}
                >
                  {step.n}
                </p>
                <h3 className="text-white font-semibold text-xl mb-2" style={{ letterSpacing: "-0.4px" }}>
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
