"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";

const faqs = [
  { n: "01", q: "What kind of businesses is Bayana built for?", a: "Bayana is built for hospital and pharmacy SMEs in Nairobi who are tracking stock, patient visits, and revenue in Excel and want it in one live dashboard instead." },
  { n: "02", q: "Do I need to reformat my Excel files?", a: "No — Bayana is built around the exact Excel format hospitals already use. Just upload your monthly file." },
  { n: "03", q: "Can I ask questions about my own data?", a: "Yes — Bayana includes a chatbot that answers questions about your stock, visits, and revenue in plain English." },
  { n: "04", q: "Is my data secure?", a: "Yes — each organization's data is isolated and only accessible to your team." },
  { n: "05", q: "Can I use this across multiple branches?", a: "Yes — Bayana supports multiple branches under one organization from day one." },
];

export default function FAQ() {
  return (
    <section className="py-[60px] md:py-[100px] px-5 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={stagger}
        className="max-w-[800px] mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="text-white font-medium" style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}>
            Got questions?
          </h2>
          <p className="text-white/50 text-lg mt-2">We've got answers.</p>
          <p className="text-white/40 text-sm mt-4">Here's everything you need to know before getting started.</p>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq) => (
            <motion.div
              key={faq.n}
              variants={fadeUp}
              className="py-4 border-t border-[#1a1a1a] last:border-b"
            >
              <div className="flex items-start gap-6">
                <span className="text-clario-accent text-sm font-medium font-mono pt-1">{faq.n}</span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base mb-1">{faq.q}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}