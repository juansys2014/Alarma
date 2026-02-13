"use client"

import { useParams } from "next/navigation"
import { GroupDetail } from "@/components/group-detail"

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  return <GroupDetail groupId={groupId} />
}
