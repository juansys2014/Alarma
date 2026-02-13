"use client"

import { useParams } from "next/navigation"
import { AlertDetailScreen } from "@/components/alert-detail-screen"

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  return <AlertDetailScreen eventId={eventId} />
}
