import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const ADAL_BASE_URL = process.env.ADAL_BASE_URL!;
const ADAL_JWT = process.env.ADAL_JWT!;
const ADAL_AGENT_ID = process.env.ADAL_AGENT_ID!;

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    // Get the real org_id server-side — never trust the client for this
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

    // Create a session if we don't have one yet
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const sessionRes = await fetch(`${ADAL_BASE_URL}/v1/sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADAL_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: ADAL_AGENT_ID }),
      });
      const sessionData = await sessionRes.json();
      activeSessionId = sessionData.session_id;
    }

    // Send the message, prefixing org_id so tools can use it
    const chatRes = await fetch(
      `${ADAL_BASE_URL}/v1/sessions/${activeSessionId}/chat/stream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADAL_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: `[org_id: ${orgId}] ${message}` }),
      }
    );

    // Parse SSE, only keep assistant.message.completed text
    const text = await chatRes.text();
    let reply = "";
    for (const line of text.split("\n")) {
      if (!line.startsWith("data:")) continue;
      try {
        const evt = JSON.parse(line.slice(5).trim());
        if (evt.type === "assistant.message.completed") {
          reply = evt.text ?? evt.message ?? reply;
        }
        if (evt.type === "command.failed") {
          return NextResponse.json({ error: "Assistant error" }, { status: 502 });
        }
      } catch {
        // skip malformed lines
      }
    }

    return NextResponse.json({ reply, sessionId: activeSessionId });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}