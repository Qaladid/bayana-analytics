"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { stagger, fadeUp } from "@/lib/tokens";

export default function FinalCTA() {
  return (
    <section className="py-[60px] md:py-[115px] px-5 md:px-10" style={{ background: "#0d0d0d" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={stagger}
        className="max-w-[800px] mx-auto text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-white font-medium mb-6 text-[32px] md:text-[56px]"
          style={{ letterSpacing: "-2.24px", lineHeight: "1.15" }}
        >
          Ready to see your data clearly?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/50 text-xl mb-12 max-w-[600px] mx-auto leading-relaxed">
          Upload your Excel exports and get a live dashboard in minutes — no setup, no spreadsheets.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Button variant="filled" href="/auth/login">Get Started Free</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
