import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
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

    // Demo-mode activation — no real payment processor involved yet.
    // Replace with a Stripe webhook handler when live billing is wired up.
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("org_id", orgId)
      .single();

    if (existing) {
      await supabase
        .from("subscriptions")
        .update({ subscription_status: "active", updated_at: new Date().toISOString() })
        .eq("org_id", orgId);
    } else {
      await supabase
        .from("subscriptions")
        .insert({ org_id: orgId, subscription_status: "active", updated_at: new Date().toISOString() });
    }

    return NextResponse.json({ status: "active" });
  } catch (err) {
    console.error("Activate-subscription route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}