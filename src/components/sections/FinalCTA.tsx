"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { stagger, fadeUp } from "@/lib/tokens";

export default function FinalCTA() {
  return (
    <section className="py-[380px] px-10" style={{ background: "#0d0d0d" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="max-w-[800px] mx-auto text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-white font-medium mb-4"
          style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
        >
          Ready to manage your money smarter?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/50 text-lg mb-8">
          Start your journey to smarter spending and better saving — it only takes 2 minutes.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Button variant="filled" href="#get-started">Get Started Free</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
