import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Extend Vercel function timeout to 60s — AdaL SDK + Render cold start needs it
export const maxDuration = 60;

const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL!;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Resolve org_id server-side — never trust the client for this
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { data: userRow } = await supabase
      .from("users")
      .select("org_id")
      .eq("id", user.id)
      .single();
    const orgId = userRow?.org_id;
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    // Proxy to the self-hosted AdaL SDK service
    const res = await fetch(`${CHAT_SERVICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: orgId, message }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Chat service error:", res.status, detail);
      return NextResponse.json({ error: "Assistant error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
