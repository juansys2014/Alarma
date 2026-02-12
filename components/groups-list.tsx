"use client"

import { Users, Plus, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Group {
  id: string
  name: string
  role: "Admin" | "Miembro"
  members: number
  initials: string
  color: string
}

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Equipo de Desarrollo",
    role: "Admin",
    members: 12,
    initials: "ED",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "2",
    name: "Marketing Digital",
    role: "Miembro",
    members: 8,
    initials: "MD",
    color: "bg-foreground/80 text-background",
  },
  {
    id: "3",
    name: "Soporte Tecnico",
    role: "Admin",
    members: 5,
    initials: "ST",
    color: "bg-muted-foreground text-background",
  },
  {
    id: "4",
    name: "Recursos Humanos",
    role: "Miembro",
    members: 15,
    initials: "RH",
    color: "bg-primary/70 text-primary-foreground",
  },
  {
    id: "5",
    name: "Ventas y Negocios",
    role: "Miembro",
    members: 22,
    initials: "VN",
    color: "bg-foreground/60 text-background",
  },
]

function GroupCard({ group }: { group: Group }) {
  return (
    <Card className="flex items-center gap-3.5 p-4 transition-colors hover:bg-muted/50 active:bg-muted/70">
      <Avatar className="h-11 w-11 shrink-0 rounded-xl">
        <AvatarFallback className={`rounded-xl text-sm font-semibold ${group.color}`}>
          {group.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {group.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={group.role === "Admin" ? "default" : "secondary"}
            className="h-5 px-1.5 text-[10px] font-medium"
          >
            {group.role}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {group.members} miembros
          </span>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground" aria-label={`Entrar a ${group.name}`}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}

export function GroupsList() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mis Grupos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {MOCK_GROUPS.length} grupos activos
          </p>
        </div>
      </header>

      {/* Group list */}
      <div className="flex-1 px-5 pb-28 pt-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {MOCK_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-5 pb-8 pt-4" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
        <div className="mx-auto w-full max-w-lg">
          <Button className="h-12 w-full text-base font-medium shadow-lg">
            <Plus className="h-5 w-5" />
            Crear Grupo
          </Button>
        </div>
      </div>
    </div>
  )
}
