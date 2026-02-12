import { AdminGroupDetail } from "@/components/admin-group-detail"

export default async function AdminGroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  return <AdminGroupDetail groupId={groupId} />
}
