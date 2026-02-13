"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { canAccessSystemAdmin } from "@/lib/permissions"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!canAccessSystemAdmin()) {
      router.replace("/grupos")
    }
  }, [router])

  if (!canAccessSystemAdmin()) return null

  return <>{children}</>
}
