"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { stagger, fadeUp, fadeUpSmall, fadeUpTiny } from "@/lib/tokens";
import HeroMockup from "@/components/ui/HeroMockup";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-[120px] md:pt-[166px] pb-[60px] md:pb-[80px] px-5 md:px-10 overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex flex-col items-center text-center max-w-[809px] mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d0d0d] border border-[#1f1f1f]"
        >
          <span className="w-2 h-2 rounded-full bg-clario-accent" />
          <span className="text-sm text-white/80 font-medium">Hospital Data Pipeline</span>
        </motion.div>

        {/* Headline — positioned so y ≈ 202 (badge ~140px tall + 0 gap) */}
        <motion.h1
          variants={fadeUp}
          className="text-white font-medium text-center text-[36px] md:text-[64px]"
          style={{
            letterSpacing: "-2.56px",
            lineHeight: "1",
            maxWidth: "720px",
            marginTop: "40px",
          }}
        >
          Turn messy hospital data into clarity — instantly
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUpSmall}
          className="mt-6 md:mt-10 text-center"
          style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "27px",
            color: "rgba(255, 255, 255, 0.65)",
            maxWidth: "540px",
          }}
        >
          Upload your Excel exports and get a live dashboard of stock, patient visits, and revenue — no spreadsheets, no guesswork.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUpTiny} className="mt-8 md:mt-14">
          <Button variant="filled" href="/auth/login">Get Started Free</Button>
        </motion.div>
      </motion.div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-[60px] md:mt-[100px] w-full max-w-[978px]"
      >
        <HeroMockup />
      </motion.div>
    </section>
  );
}
