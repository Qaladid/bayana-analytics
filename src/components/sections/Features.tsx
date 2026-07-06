"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";
import { Wallet, Target, Tag, Mail, AlertCircle, Shield } from "lucide-react";

const features = [
  { icon: Wallet, title: "Multi-account sync", desc: "Connect and track all your bank accounts in one place." },
  { icon: Target, title: "Goal tracking", desc: "Visualize progress toward savings goals in real-time." },
  { icon: Tag, title: "Custom categories", desc: "Create and organize spending your way — not the bank's." },
  { icon: Mail, title: "Weekly reports", desc: "Get a snapshot of your finances delivered to your inbox." },
  { icon: AlertCircle, title: "Spending limits", desc: "Set monthly caps and get notified when you're close." },
  { icon: Shield, title: "Secure & private", desc: "Your data is encrypted and never shared — ever." },
];

export default function Features() {
  return (
    <section id="features" className="py-[152px] px-10">
      <div className="max-w-[1199px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-clario-accent text-sm font-medium uppercase tracking-widest mb-4">
            Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium max-w-[700px] mx-auto"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            Designed for clarity, built for better money decisions
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUpCard}
              className="rounded-[30px] p-8"
              style={{
                background: "#0d0d0d",
                boxShadow:
                  "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05)",
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center mb-5">
                <f.icon className="h-5 w-5 text-clario-accent" strokeWidth={2} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
