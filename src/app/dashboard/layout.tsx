import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Sidebar from '@/components/dashboard/Sidebar'
import ChatWidget from '@/components/ui/ChatWidget'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware handles the redirect, but double-check server-side
  if (!user) redirect('/auth/login')

  // Fetch the user's profile + org from public.users
  const { data: profile } = await supabase
    .from('users')
    .select('role, email, organizations(name)')
    .eq('id', user.id)
    .single()

  const orgs = profile?.organizations as { name: string }[] | null
  const orgName = orgs?.[0]?.name ?? 'Your Organization'
  const userEmail = profile?.email ?? user.email ?? ''

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/10 px-8 py-4">
          <span className="text-lg font-semibold text-white">{orgName}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40">{userEmail}</span>
            <a
              href="/auth/logout"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/5"
            >
              Sign out
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Floating AI chat widget — visible on all dashboard pages */}
      <ChatWidget />
    </div>
  )
}