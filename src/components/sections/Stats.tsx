"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";

export default function Stats() {
  return (
    <section className="py-[185px] px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <motion.div variants={fadeUp} className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e] border-2 border-[#050505]" />
              ))}
            </div>
          </div>
          <p className="text-white text-2xl font-semibold">Trusted by 3k+ Freelancers</p>
        </motion.div>

        <motion.div variants={fadeUp} className="text-center">
          <p className="text-clario-accent text-5xl font-medium" style={{ letterSpacing: "-2px" }}>
            $1.2M+ Saved
          </p>
        </motion.div>

        <motion.p variants={fadeUp} className="text-white/50 text-base max-w-[300px] text-center md:text-left">
          Clario helps users save more — and spend smarter.
        </motion.p>
      </motion.div>
    </section>
  );
}
