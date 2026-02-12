"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  mockGroups,
  mockGroupMembers,
  mockGroupEvents,
  mockUsers,
  type GroupMember,
  type GroupRole,
} from "@/lib/mock-data"
import {
  ArrowLeft,
  Users,
  Send,
  Clock,
  Shield,
  User,
  UserPlus,
  Trash2,
  ShieldAlert,
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function GroupAdminPanel({ groupId }: { groupId: string }) {
  const router = useRouter()
  const { canAdminGroup } = useAuth()
  const group = mockGroups.find((g) => g.id === groupId)
  const [members, setMembers] = useState<GroupMember[]>(mockGroupMembers[groupId] || [])
  const events = mockGroupEvents[groupId] || []

  if (!group) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Grupo no encontrado</p>
      </div>
    )
  }

  if (!canAdminGroup(groupId)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-5">
        <ShieldAlert className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Acceso denegado</p>
        <p className="text-center text-xs text-muted-foreground">
          No tienes permisos de administrador para este grupo
        </p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    )
  }

  function changeRole(userId: string, newRole: GroupRole) {
    setMembers((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, groupRole: newRole } : m))
    )
  }

  function toggleAlerts(userId: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, receivesAlerts: !m.receivesAlerts } : m
      )
    )
  }

  function removeMember(userId: string) {
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "activa":
        return <ShieldAlert className="h-4 w-4 text-destructive" />
      case "resuelta":
        return <CheckCircle2 className="h-4 w-4 text-primary" />
      case "cancelada":
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "activa":
        return <Badge variant="destructive" className="text-[10px]">Activa</Badge>
      case "resuelta":
        return <Badge variant="default" className="text-[10px]">Resuelta</Badge>
      case "cancelada":
        return <Badge variant="secondary" className="text-[10px]">Cancelada</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground"
              aria-label="Volver"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
                  {group.name}
                </h1>
                <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Panel de administracion</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-28 pt-2">
        <div className="mx-auto w-full max-w-lg">
          <Tabs defaultValue="miembros" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="miembros" className="gap-1 text-xs">
                <Users className="h-3.5 w-3.5" />
                Miembros
              </TabsTrigger>
              <TabsTrigger value="destinatarios" className="gap-1 text-xs">
                <Send className="h-3.5 w-3.5" />
                Destinatarios
              </TabsTrigger>
              <TabsTrigger value="eventos" className="gap-1 text-xs">
                <Clock className="h-3.5 w-3.5" />
                Eventos
              </TabsTrigger>
            </TabsList>

            {/* Members tab */}
            <TabsContent value="miembros" className="flex flex-col gap-2">
              {members.map((m) => (
                <Card key={m.userId} className="flex items-center gap-3 p-3.5">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-muted text-xs font-bold">
                      {m.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-semibold text-foreground">{m.userName}</span>
                    <Select
                      value={m.groupRole}
                      onValueChange={(v) => changeRole(m.userId, v as GroupRole)}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GROUP_ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Miembro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeMember(m.userId)}
                    aria-label="Quitar miembro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}

              {members.length === 0 && (
                <Card className="flex flex-col items-center gap-2 p-8">
                  <Users className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Sin miembros</p>
                </Card>
              )}
            </TabsContent>

            {/* Recipients tab */}
            <TabsContent value="destinatarios" className="flex flex-col gap-2">
              <p className="mb-2 text-xs text-muted-foreground">
                Controla quien recibe notificaciones de alertas en este grupo.
              </p>
              {members.map((m) => (
                <Card key={m.userId} className="flex items-center gap-3 p-3.5">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-muted text-xs font-bold">
                      {m.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">{m.userName}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {m.receivesAlerts ? (
                        <>
                          <Bell className="h-3 w-3" />
                          Recibe alertas
                        </>
                      ) : (
                        <>
                          <BellOff className="h-3 w-3" />
                          No recibe alertas
                        </>
                      )}
                    </span>
                  </div>
                  <Switch
                    checked={m.receivesAlerts}
                    onCheckedChange={() => toggleAlerts(m.userId)}
                  />
                </Card>
              ))}
            </TabsContent>

            {/* Events tab */}
            <TabsContent value="eventos" className="flex flex-col gap-2">
              {events.length === 0 ? (
                <Card className="flex flex-col items-center gap-2 p-8">
                  <Clock className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Sin eventos registrados</p>
                </Card>
              ) : (
                events.map((e) => (
                  <Card key={e.id} className="flex items-center gap-3 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      {statusIcon(e.status)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{e.id}</span>
                        {statusBadge(e.status)}
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {e.triggeredBy} &middot; {e.timestamp}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
