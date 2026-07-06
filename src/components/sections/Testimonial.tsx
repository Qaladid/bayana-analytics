"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";

export default function Testimonial() {
  return (
    <section className="py-[460px] px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="max-w-[1000px] mx-auto"
      >
        <motion.p variants={fadeUp} className="text-center text-white/40 text-sm uppercase tracking-widest mb-4">
          Hear from our users
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-center text-white font-medium mb-12"
          style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
        >
          Loved by individuals and small teams
        </motion.h2>

        <motion.div variants={fadeUp} className="text-center max-w-[700px] mx-auto">
          <p className="text-white/50 text-base mb-8">
            People across industries trust Clario to manage money, reduce stress, and make smarter decisions — all in one simple dashboard.
          </p>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-clario-accent to-[#5a9e1e] flex items-center justify-center mb-4">
              <span className="text-[#0d0d0d] font-bold text-2xl">DM</span>
            </div>
            <p className="text-white font-semibold">Danielle M.</p>
            <p className="text-white/40 text-sm mb-6">Freelance UX Designer</p>

            <blockquote
              className="text-white font-medium text-3xl max-w-[600px]"
              style={{ letterSpacing: "-0.5px", lineHeight: "40px" }}
            >
              &ldquo;With Clario, I finally stopped stressing about my cash flow. I know where my money is going — and I&rsquo;m actually saving.&rdquo;
            </blockquote>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
