"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Upload,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Stock Levels", href: "/dashboard/stock", icon: Package },
  { label: "Patient Visits", href: "/dashboard/visits", icon: Users },
  { label: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { label: "Upload Data", href: "/dashboard/upload", icon: Upload },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#0B1220] px-4 py-6"
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <span className="text-white text-base font-semibold tracking-tight">
          Bayana Analytics
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1D4ED8]/15 text-[#60A5FA]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}