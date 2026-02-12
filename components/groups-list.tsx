"use client"

import { useNavigation } from "./app-shell"
import { Users, Plus, ChevronRight, ShieldAlert, UserCircle } from "lucide-react"
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

function GroupCard({ group, onSelect }: { group: Group; onSelect: () => void }) {
  return (
    <Card className="flex cursor-pointer items-center gap-3.5 p-4 transition-colors hover:bg-muted/50 active:bg-muted/70" onClick={onSelect}>
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
  const { navigate } = useNavigation()
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
      <div className="flex-1 px-5 pb-40 pt-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {MOCK_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} onSelect={() => navigate("group-detail")} />
          ))}

          {/* Crear grupo inline */}
          <Button
            variant="outline"
            className="h-12 w-full border-dashed text-sm font-medium text-muted-foreground"
            onClick={() => navigate("create-group")}
          >
            <Plus className="h-4 w-4" />
            Crear Grupo
          </Button>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 pb-6 pt-2">
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-foreground"
            aria-label="Mis Grupos"
          >
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Grupos</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("contacts")}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Contactos"
          >
            <UserCircle className="h-5 w-5" />
            <span className="text-[10px] font-medium">Contactos</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("panic-button")}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-destructive transition-colors"
            aria-label="Boton de Panico"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive">
              <ShieldAlert className="h-5 w-5 text-destructive-foreground" />
            </div>
            <span className="text-[10px] font-semibold">Panico</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("alert-detail")}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Alertas"
          >
            <div className="relative">
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-destructive" />
            </div>
            <span className="text-[10px] font-medium">Alertas</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
