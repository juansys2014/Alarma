"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isSystemAdmin } = useAuth()

  useEffect(() => {
    if (!isSystemAdmin) {
      router.replace("/grupos")
    }
  }, [isSystemAdmin, router])

  if (!isSystemAdmin) return null

  return <>{children}</>
}
