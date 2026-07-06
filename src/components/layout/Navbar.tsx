"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { stagger, fadeUpSmall } from "@/lib/tokens";

const navLinks = ["How it works", "Features", "Pricing", "Blog"];

export default function Navbar() {
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-10 backdrop-blur-md"
      style={{ background: "rgba(5, 5, 5, 0.5)" }}
    >
      {/* Logo */}
      <motion.a href="#" variants={fadeUpSmall} className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-clario-accent flex items-center justify-center">
          <span className="text-[#0d0d0d] font-bold text-sm">C</span>
        </div>
        <span className="text-white text-lg font-semibold tracking-tight">Clario</span>
      </motion.a>

      {/* Nav links */}
      <motion.div variants={fadeUpSmall} className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
            className="text-white text-base font-medium hover:text-clario-accent transition-colors"
          >
            {link}
          </a>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div variants={fadeUpSmall} className="hidden md:flex items-center gap-3">
        <Button variant="outline" href="#waitlist">Waitlist</Button>
        <Button variant="filled" href="#contact" compact>Contact</Button>
      </motion.div>

      {/* Mobile menu button */}
      <button className="md:hidden text-white">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </motion.nav>
  );
}
