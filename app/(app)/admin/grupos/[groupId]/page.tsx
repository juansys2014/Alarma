"use client"

import { useParams } from "next/navigation"
import { AdminGroupDetail } from "@/components/admin-group-detail"

export default function AdminGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  return <AdminGroupDetail groupId={groupId} />
}
