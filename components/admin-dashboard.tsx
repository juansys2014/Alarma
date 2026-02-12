"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { mockUsers, mockGroups, mockGroupEvents } from "@/lib/mock-data"
import { Users, Layers, ShieldAlert, ArrowRight, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const totalEvents = Object.values(mockGroupEvents).flat().length
const activeEvents = Object.values(mockGroupEvents)
  .flat()
  .filter((e) => e.status === "activa").length

const stats = [
  { label: "Usuarios", value: mockUsers.length, icon: Users, href: "/admin/usuarios" },
  { label: "Grupos", value: mockGroups.length, icon: Layers, href: "/admin/grupos" },
  { label: "Alertas activas", value: activeEvents, icon: ShieldAlert, href: null },
  { label: "Total eventos", value: totalEvents, icon: Shield, href: null },
]

export function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Panel Admin</h1>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-28 pt-2">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const content = (
                <Card key={stat.label} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  </div>
                </Card>
              )
              if (stat.href) {
                return (
                  <Link key={stat.label} href={stat.href}>
                    {content}
                  </Link>
                )
              }
              return content
            })}
          </div>

          {/* Quick links */}
          <h2 className="mt-2 text-sm font-semibold text-muted-foreground">Accesos rapidos</h2>

          <Link href="/admin/usuarios">
            <Card className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Gestionar Usuarios</span>
                  <span className="text-xs text-muted-foreground">{mockUsers.length} usuarios registrados</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>

          <Link href="/admin/grupos">
            <Card className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Gestionar Grupos</span>
                  <span className="text-xs text-muted-foreground">{mockGroups.length} grupos activos</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>

          {/* Recent users */}
          <h2 className="mt-2 text-sm font-semibold text-muted-foreground">Usuarios recientes</h2>
          <Card className="divide-y">
            {mockUsers.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
                    {u.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">{u.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{u.email}</span>
                </div>
                <Badge
                  variant={u.status === "activo" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {u.status}
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
