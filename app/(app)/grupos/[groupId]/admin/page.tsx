"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GroupAdminPanel } from "@/components/group-admin-panel"

export default function GroupAdminPage() {
  const router = useRouter()
  const { groupId } = useParams<{ groupId: string }>()
  const { canAdminGroup } = useAuth()
  const hasAccess = canAdminGroup(groupId)

  useEffect(() => {
    if (!hasAccess) {
      router.replace(`/grupos/${groupId}`)
    }
  }, [hasAccess, router, groupId])

  if (!hasAccess) return null

  return <GroupAdminPanel groupId={groupId} />
}
