import { GroupDetail } from "@/components/group-detail"

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  return <GroupDetail groupId={groupId} />
}
