import { AlertDetailScreen } from "@/components/alert-detail-screen"

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  return <AlertDetailScreen eventId={eventId} />
}
