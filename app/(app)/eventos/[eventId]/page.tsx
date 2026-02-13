"use client"

import { useParams } from "next/navigation"
import { EventDetailView } from "@/components/event-detail"

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  return <EventDetailView eventId={eventId} />
}
