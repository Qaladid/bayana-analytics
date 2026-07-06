"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";

const cards = [
  {
    title: "Smart Dashboard",
    desc: "See all your accounts in one view — balances, spending, and goals.",
    type: "dashboard",
  },
  {
    title: "Cashflow Overview",
    desc: "Track your daily income and expenses to understand your financial flow.",
    type: "cashflow",
  },
  {
    title: "Spending Breakdown",
    desc: "See exactly how your money is split across categories.",
    type: "donut",
  },
  {
    title: "Savings Goal",
    desc: "Stay focused on your savings targets and follow your progress.",
    type: "savings",
  },
];

function CardMockup({ type }: { type: string }) {
  if (type === "dashboard") {
    return (
      <div className="w-full h-[200px] md:h-[370px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f]">
        <p className="text-white text-sm font-semibold mb-4">All Accounts</p>
        <div className="space-y-2">
          {["Checking", "Savings", "Credit"].map((acc, i) => (
            <div key={acc} className="flex justify-between items-center py-2 border-b border-[#1f1f1f]">
              <span className="text-white/60 text-xs">{acc}</span>
              <span className="text-white text-xs font-semibold">${[8420, 3400, 1027][i]}.00</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === "cashflow") {
    return (
      <div className="w-full h-[200px] md:h-[370px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f]">
        <div className="flex justify-between mb-4">
          <p className="text-white text-sm font-semibold">Cashflow</p>
          <p className="text-white/40 text-xs">Last 7 Days</p>
        </div>
        <svg viewBox="0 0 280 140" className="w-full h-[140px]">
          <polyline points="0,100 40,80 80,90 120,60 160,70 200,40 240,50 280,30" fill="none" stroke="#8cff2e" strokeWidth="2" />
          <polyline points="0,120 40,110 80,115 120,100 160,105 200,90 240,95 280,85" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }
  if (type === "donut") {
    return (
      <div className="w-full h-[200px] md:h-[370px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f] flex flex-col items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#8cff2e" strokeWidth="15" strokeDasharray="120 283" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeDasharray="80 283" strokeDashoffset="-120" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" strokeDasharray="83 283" strokeDashoffset="-200" transform="rotate(-90 60 60)" />
        </svg>
        <p className="text-white text-lg font-semibold mt-3">$3,500</p>
        <p className="text-white/40 text-xs">Total Spending</p>
      </div>
    );
  }
  return (
    <div className="w-full h-[200px] md:h-[370px] rounded-2xl p-5 bg-[#171717] border border-[#1f1f1f] flex flex-col justify-center">
      <div className="flex justify-between mb-2">
        <p className="text-white text-sm font-semibold">Vacation Fund</p>
        <p className="text-clario-accent text-xs">$3,000 / $5,000</p>
      </div>
      <div className="w-full h-3 rounded-full bg-[#0d0d0d] mb-4">
        <div className="h-full rounded-full bg-clario-accent" style={{ width: "60%" }} />
      </div>
      <div className="flex -space-x-2 mb-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e] border-2 border-[#171717]" />
        ))}
      </div>
      <p className="text-white/40 text-xs">Due Dec 2026</p>
    </div>
  );
}

export default function RealtimeCards() {
  return (
    <section className="py-[60px] md:py-[100px] px-5 md:px-10">
      <div className="max-w-[1199px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            See your money in real time, clearly.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/50 text-lg mt-4 max-w-[600px] mx-auto"
          >
            Clario shows your income, spending, and goals in simple visuals you can act on — right away.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUpCard}
              className="rounded-[30px] p-2.5 pb-[30px]"
              style={{
                background: "#0d0d0d",
                boxShadow:
                  "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)",
              }}
            >
              <CardMockup type={card.type} />
              <div className="px-3 pt-4">
                <h3 className="text-white font-semibold text-lg mb-1" style={{ letterSpacing: "-0.4px" }}>
                  {card.title}
                </h3>
                <p className="text-white/50 text-sm">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
