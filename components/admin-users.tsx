"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { mockUsers, type AppUser, type GlobalRole } from "@/lib/mock-data"
import {
  ArrowLeft,
  Search,
  UserPlus,
  Shield,
  User,
  Loader2,
  CheckCircle2,
  Mail,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"

export function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<AppUser[]>(mockUsers)
  const [search, setSearch] = useState("")
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviteRole, setInviteRole] = useState<GlobalRole>("USER")
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleInvite = useCallback(() => {
    if (!inviteEmail.trim() || !inviteName.trim()) return
    setInviting(true)
    setTimeout(() => {
      const initials = inviteName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      setUsers((prev) => [
        ...prev,
        {
          id: `u-new-${Date.now()}`,
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          initials,
          globalRole: inviteRole,
          status: "pendiente",
          createdAt: "Hoy",
        },
      ])
      setInviting(false)
      setInviteSuccess(true)
      setTimeout(() => {
        setShowInvite(false)
        setInviteEmail("")
        setInviteName("")
        setInviteRole("USER")
        setInviteSuccess(false)
      }, 1200)
    }, 1500)
  }, [inviteEmail, inviteName, inviteRole])

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
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground">Usuarios</h1>
              <p className="text-xs text-muted-foreground">{users.length} registrados</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 pl-9 text-sm"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-28 pt-2">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
          {/* Invite button */}
          <Button className="mb-2 h-11 w-full text-sm font-medium" onClick={() => setShowInvite(true)}>
            <UserPlus className="h-4 w-4" />
            Invitar Usuario
          </Button>

          {/* User list */}
          {filteredUsers.map((u) => (
            <Card key={u.id} className="flex items-center gap-3 p-3.5">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarFallback className="rounded-xl bg-muted text-xs font-bold">
                  {u.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">{u.name}</span>
                  {u.globalRole === "SYSTEM_ADMIN" && (
                    <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </div>
                <span className="truncate text-xs text-muted-foreground">{u.email}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge
                  variant={u.status === "activo" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {u.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{u.createdAt}</span>
              </div>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <User className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle>Invitar Usuario</DialogTitle>
            <DialogDescription>Ingresa los datos del nuevo usuario</DialogDescription>
          </DialogHeader>

          {inviteSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Usuario invitado</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Nombre</Label>
                <Input
                  placeholder="Nombre completo"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Rol global</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["USER", "SYSTEM_ADMIN"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setInviteRole(role)}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                        inviteRole === role
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {role === "SYSTEM_ADMIN" ? (
                        <Shield className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {role === "SYSTEM_ADMIN" ? "Admin" : "Usuario"}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                className="mt-2 h-11 w-full"
                disabled={!inviteEmail.trim() || !inviteName.trim() || inviting}
                onClick={handleInvite}
              >
                {inviting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Invitando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Invitar
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
