import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * OAuth + email-confirmation callback.
 * Exchanges the one-time `code` for a session, then activates the
 * org's subscription (demo-mode — no real payment processor yet).
 * Org + user profile creation is handled automatically by the
 * `on_auth_user_created` database trigger — nothing extra needed here.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
  }

  // Demo-mode subscription activation — no real payment processor yet.
  // Replace with a Stripe webhook handler when live billing is wired up.
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: userRow } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    const orgId = userRow?.org_id
    if (orgId) {
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('org_id', orgId)
        .single()

      if (existing) {
        await supabase
          .from('subscriptions')
          .update({ subscription_status: 'active', updated_at: new Date().toISOString() })
          .eq('org_id', orgId)
      } else {
        await supabase
          .from('subscriptions')
          .insert({ org_id: orgId, subscription_status: 'active', updated_at: new Date().toISOString() })
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}