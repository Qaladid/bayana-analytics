"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/tokens";

export default function Testimonial() {
  return (
    <section className="py-[60px] md:py-[100px] px-5 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={stagger}
        className="max-w-[1000px] mx-auto"
      >
        <motion.p variants={fadeUp} className="text-center text-white/40 text-sm uppercase tracking-widest mb-6">
          Hear from our users
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-center text-white font-medium mb-12 md:mb-32"
          style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
        >
          Loved by hospitals and pharmacies
        </motion.h2>

        <motion.div variants={fadeUp} className="text-center max-w-[700px] mx-auto">
          <p className="text-white/50 text-base md:text-xl mb-10 md:mb-28 leading-relaxed max-w-[560px] mx-auto">
            Hospitals and pharmacies across Nairobi trust Bayana to manage stock, visits, and revenue — all in one simple dashboard.
          </p>

          <div className="flex flex-col items-center">
            <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full bg-gradient-to-br from-clario-accent to-[#3B82F6] flex items-center justify-center mb-8">
              <span className="text-[#0d0d0d] font-bold text-3xl">JM</span>
            </div>
            <p className="text-white font-semibold text-lg">James M.</p>
            <p className="text-white/40 text-sm mb-8 md:mb-16">Pharmacy Operations Manager</p>

            <blockquote
              className="text-white font-medium max-w-[640px] text-[28px] md:text-[48px]"
              style={{ letterSpacing: "-1px", lineHeight: "1.5" }}
            >
              &ldquo;With Bayana, I finally stopped digging through Excel sheets every week. I know exactly what's happening across our branches — in real time.&rdquo;
            </blockquote>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}