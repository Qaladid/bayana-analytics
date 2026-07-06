"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "filled" | "outline" | "dark";
  href?: string;
  className?: string;
};

export default function Button({ children, variant = "filled", href = "#", className = "" }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-[23px] px-6 py-3 text-[15px] font-semibold transition-all";
  const variants = {
    filled: "bg-clario-accent text-[#0d0d0d] shadow-cta hover:brightness-110",
    outline: "bg-clario-border text-white hover:bg-[#2a2a2a]",
    dark: "bg-[#0d0d0d] text-white border border-[#2f2f2f] hover:bg-[#171717]",
  };

  const content = (
    <motion.span
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{children}</span>
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </motion.span>
  );

  return <a href={href}>{content}</a>;
}
