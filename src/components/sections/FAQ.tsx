"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";

const faqs = [
  { n: "01", q: "What kind of businesses is this template built for?", a: "Clario is designed for SaaS tools, dashboards, fintech platforms, or any digital product that needs a modern, conversion-focused landing page. It's fully customizable to fit a wide range of web-based services." },
  { n: "02", q: "Is the template mobile-friendly and responsive?", a: "Absolutely. The layout adapts beautifully to all screen sizes, including desktops, tablets, and smartphones. Every section is designed to deliver a seamless experience across devices." },
  { n: "03", q: "Can I use this template without coding skills?", a: "Yes — the template is fully editable in Framer with drag-and-drop tools. No coding knowledge is required to update text, swap images, or adjust layouts." },
  { n: "04", q: "Will I get access to future updates?", a: "Yes. Once purchased, you'll automatically receive any future improvements or optimizations we make to the template. Your version stays up-to-date with best practices." },
  { n: "05", q: "Can I use this template for commercial projects?", a: "Definitely. Clario is licensed for both personal and commercial use, so you can build client websites or launch your own product without any licensing issues." },
  { n: "06", q: "How can I get support if I run into issues?", a: "We're here to help. If you have questions, you can reach us directly at hello@kadirov.design. We usually respond within 24 hours." },
];

export default function FAQ() {
  return (
    <section className="py-[20px] px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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

        <div className="space-y-px">
          {faqs.map((faq) => (
            <motion.div
              key={faq.n}
              variants={fadeUp}
              className="py-6 border-t border-[#1a1a1a] last:border-b"
            >
              <div className="flex items-start gap-6">
                <span className="text-clario-accent text-sm font-medium font-mono pt-1">{faq.n}</span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
