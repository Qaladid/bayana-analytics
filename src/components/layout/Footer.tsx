"use client";
import { Twitter, Linkedin, Github } from "lucide-react";

const menuLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#" },
  { label: "Pricing", href: "#pricing" },
];

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
];

export default function Footer() {
  return (
    <footer className="px-10 pt-16 pb-8" style={{ background: "#0d0d0d" }}>
      <div className="max-w-[1199px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-clario-accent flex items-center justify-center">
                <span className="text-[#0d0d0d] font-bold text-sm">C</span>
              </div>
              <span className="text-white text-lg font-semibold tracking-tight">Clario</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[300px]">
              Your all-in-one money management tool. Track your income, set goals, and stay on top of your finances — effortlessly.
            </p>
          </div>

          {/* Quick menu */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Quick Menu</p>
            <div className="space-y-2">
              {menuLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-white/40 text-sm hover:text-clario-accent transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Connect</p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center hover:bg-clario-accent/20 transition-colors"
                >
                  <social.icon className="h-4 w-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a]">
          <p className="text-white/40 text-xs">Designed by Kadir Calik</p>
          <p className="text-white/40 text-xs">©2026</p>
        </div>
      </div>
    </footer>
  );
}
