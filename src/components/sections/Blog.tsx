"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeUpCard } from "@/lib/tokens";

const posts = [
  {
    category: "Basics",
    title: "How to Launch Your SaaS Product With Confidence",
    desc: "Learn how to go from idea to launch — fast. We cover positioning, landing pages, early user feedback, and building trust using the Clario template for Framer.",
    href: "./blog/getting-started#post",
  },
  { category: "Pro Tips", title: "Designing a Landing Page That Converts", desc: "Your landing page is your storefront. Here's how to structure it for clarity, trust, and higher conversion rates — without sacrificing design quality.", href: "./blog/landing-page-design#post" },
  { category: "Updates", title: "Collecting Feedback From Your First Users", desc: "Early user feedback is gold. Learn how to set up feedback loops, prioritize input, and turn it into meaningful product improvements.", href: "./blog/early-user-feedback#post" },
  { category: "CMS", title: "Building Trust as an Early-Stage SaaS Brand", desc: "Trust is the hardest thing to earn — and the easiest to lose. Here's how early-stage brands can build credibility from day one.", href: "./blog/building-trust#post" },
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
              <div className="w-full h-[280px] md:h-[540px] bg-gradient-to-br from-[#1a2e05] to-[#0d0d0d] flex items-center justify-center">
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
