"use client"

import { AuthProvider } from "@/lib/auth-context"
import { BottomNav } from "@/components/bottom-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-svh flex-col bg-background">
        <main className="flex-1 pb-28">{children}</main>
        <BottomNav />
      </div>
    </AuthProvider>
  )
}
