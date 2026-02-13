// Legacy route redirect - forces new chunk compilation
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LegacyEventRedirectPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  redirect(`/evento/${eventId}`)
}
