"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";

const posts = [
  {
    category: "Case Study",
    title: "From Excel Chaos to Clarity: A Case Study",
    desc: "How a Nairobi clinic replaced monthly spreadsheets with a live dashboard — and cut reporting time by 80%.",
    href: "./blog/excel-to-clarity#post",
  },
  { category: "Pharmacy", title: "5 Signs Your Pharmacy Needs a Data Dashboard", desc: "Stockouts, manual re-entry, stale reports — here are the warning signs it's time to move beyond Excel.", href: "./blog/pharmacy-dashboard#post" },
  { category: "Hospitals", title: "How Nairobi Hospitals Are Ditching Spreadsheets", desc: "More hospitals are trading Excel for real-time dashboards. Here's what changed for their teams.", href: "./blog/ditching-spreadsheets#post" },
  { category: "Stock", title: "Why Real-Time Stock Visibility Matters", desc: "Knowing your stock levels in real time prevents stockouts, waste, and lost revenue — here's how.", href: "./blog/real-time-stock#post" },
];

export default function Blog() {
  return (
    <section className="py-[60px] md:py-[100px] px-5 md:px-10">
      <div className="max-w-[1199px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="flex items-center justify-between mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="text-white font-medium"
            style={{ fontSize: "48px", letterSpacing: "-1.92px", lineHeight: "56px" }}
          >
            Explore the blog
          </motion.h2>
          <motion.a variants={fadeUp} href="./blog#blog" className="text-clario-accent text-sm font-medium hover:underline">
            View all posts →
          </motion.a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {posts.map((post) => (
            <motion.a
              key={post.title}
              href={post.href}
              variants={fadeUpCard}
              className="rounded-[30px] overflow-hidden group"
              style={{
                background: "#0d0d0d",
                boxShadow: "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05)",
              }}
            >
              {/* Image placeholder */}
              <div className="w-full h-[280px] md:h-[540px] bg-gradient-to-br from-[#0B1220] to-[#0d0d0d] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-clario-accent/20 flex items-center justify-center">
                  <span className="text-clario-accent text-xs font-bold">{post.category.slice(0, 2).toUpperCase()}</span>
                </div>
              </div>
              <div className="p-8">
                <p className="text-clario-accent text-xs font-medium uppercase tracking-widest mb-2">{post.category}</p>
                <h3 className="text-white font-semibold text-base mb-3 group-hover:text-clario-accent transition-colors">
                  {post.title}
                </h3>
                {post.desc && <p className="text-white/40 text-sm leading-[22px]">{post.desc}</p>}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}