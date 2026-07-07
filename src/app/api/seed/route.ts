import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/seed
 * Seeds demo stock + patient visit data for the current user's org.
 * Safe to call multiple times — no-ops if already seeded.
 */
export async function POST() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the user's org_id
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { data, error } = await supabase.rpc('seed_demo_data', {
    p_org_id: profile.org_id,
  })

  if (error) {
    console.error('[api/seed] error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: data }) // 'seeded' or 'already_seeded'
}
