"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Session established — middleware will validate and allow /dashboard
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo / wordmark */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bayana Analytics
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Sign in to your hospital dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-white/60">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#14B8A6] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] transition"
                placeholder="you@hospital.org"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-white/60">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#14B8A6] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-[23px] bg-[#0F6E5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
