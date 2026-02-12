import { GroupAdminPanel } from "@/components/group-admin-panel"

export default async function GroupAdminPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  return <GroupAdminPanel groupId={groupId} />
}
