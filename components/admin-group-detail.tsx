"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockGroups, mockGroupMembers, mockUsers, type GroupMember } from "@/lib/mock-data"
import {
  ArrowLeft,
  Users,
  Crown,
  Shield,
  User,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function AdminGroupDetail({ groupId }: { groupId: string }) {
  const router = useRouter()
  const group = mockGroups.find((g) => g.id === groupId)
  const [members, setMembers] = useState<GroupMember[]>(mockGroupMembers[groupId] || [])
  const [showAdd, setShowAdd] = useState(false)

  if (!group) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Grupo no encontrado</p>
      </div>
    )
  }

  const admins = members.filter((m) => m.groupRole === "GROUP_ADMIN")
  const regularMembers = members.filter((m) => m.groupRole === "MEMBER")

  const availableToAdd = mockUsers.filter(
    (u) => !members.some((m) => m.userId === u.id)
  )

  function toggleAdmin(userId: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId
          ? { ...m, groupRole: m.groupRole === "GROUP_ADMIN" ? "MEMBER" : "GROUP_ADMIN" }
          : m
      )
    )
  }

  function addAsAdmin(userId: string) {
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) return
    setMembers((prev) => [
      ...prev,
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userInitials: user.initials,
        groupRole: "GROUP_ADMIN",
        receivesAlerts: true,
      },
    ])
    setShowAdd(false)
  }

  function removeMember(userId: string) {
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }

  const roleIcon = (role: string) => {
    if (role === "GROUP_ADMIN") return <Shield className="h-3.5 w-3.5 text-primary" />
    return <User className="h-3.5 w-3.5 text-muted-foreground" />
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
            <Avatar className="h-10 w-10 rounded-xl">
              <AvatarFallback className={`rounded-xl text-xs font-bold ${group.color}`}>
                {group.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
                {group.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Propietario: {group.owner} &middot; {members.length} miembros
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-28 pt-2">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          {/* Admins section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Administradores del grupo ({admins.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </Button>
            </div>

            {admins.length === 0 ? (
              <Card className="flex items-center justify-center p-6">
                <p className="text-sm text-muted-foreground">Sin administradores asignados</p>
              </Card>
            ) : (
              admins.map((m) => (
                <Card key={m.userId} className="flex items-center gap-3 p-3.5">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-primary/10 text-xs font-bold text-primary">
                      {m.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-foreground">{m.userName}</span>
                      <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                    </div>
                    <span className="truncate text-xs text-muted-foreground">{m.userEmail}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => toggleAdmin(m.userId)}
                  >
                    Quitar admin
                  </Button>
                </Card>
              ))
            )}
          </div>

          {/* All members */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Miembros ({regularMembers.length})
            </h2>

            {regularMembers.map((m) => (
              <Card key={m.userId} className="flex items-center gap-3 p-3.5">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-muted text-xs font-bold">
                    {m.userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-foreground">{m.userName}</span>
                  <span className="truncate text-xs text-muted-foreground">{m.userEmail}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => toggleAdmin(m.userId)}
                >
                  <Shield className="h-3 w-3" />
                  Hacer admin
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add admin dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle>Agregar administrador</DialogTitle>
            <DialogDescription>Selecciona un usuario para agregarlo como admin del grupo</DialogDescription>
          </DialogHeader>
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pt-2">
            {availableToAdd.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Todos los usuarios ya son miembros
              </p>
            ) : (
              availableToAdd.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                  onClick={() => addAsAdmin(u.id)}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-muted text-xs font-bold">
                      {u.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{u.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{u.email}</span>
                  </div>
                  <Plus className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
