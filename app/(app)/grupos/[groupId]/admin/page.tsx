"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { canAccessGroupAdminRoute } from "@/lib/permissions"
import { GroupAdminPanel } from "@/components/group-admin-panel"

export default function GroupAdminPage() {
  const router = useRouter()
  const { groupId } = useParams<{ groupId: string }>()

  useEffect(() => {
    if (!canAccessGroupAdminRoute(groupId)) {
      router.replace(`/grupos/${groupId}`)
    }
  }, [router, groupId])

  if (!canAccessGroupAdminRoute(groupId)) return null

  return <GroupAdminPanel groupId={groupId} />
}
