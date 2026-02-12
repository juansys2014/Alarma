import { GroupsList } from "@/components/groups-list"

export const metadata = {
  title: "Mis Grupos",
  description: "Administra y accede a tus grupos",
}

export default function GruposPage() {
  return (
    <main>
      <GroupsList />
    </main>
  )
}
