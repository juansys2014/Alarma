import { redirect } from "next/navigation"

export default async function LegacyEventRedirect({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  redirect(`/evento/${eventId}`)
}
