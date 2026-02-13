import { GroupDetail } from "@/components/group-detail"

export default function Page({ params }: { params: { groupId: string } }) {
  return <GroupDetail groupId={params.groupId} />
}
