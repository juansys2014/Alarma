"use client"

import { useRouter } from "next/navigation"
import { mockGroups } from "@/lib/mock-data"
import { ArrowLeft, Search, Layers, Users, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminGroups() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filtered = mockGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.owner.toLowerCase().includes(search.toLowerCase())
  )

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
              <h1 className="text-lg font-bold tracking-tight text-foreground">Grupos</h1>
              <p className="text-xs text-muted-foreground">{mockGroups.length} grupos</p>
            </div>
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 pl-9 text-sm"
              placeholder="Buscar grupo o propietario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-28 pt-2">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
          <Button
            className="h-11 w-full text-sm font-medium"
            onClick={() => router.push("/grupos/nuevo")}
          >
            <Plus className="h-4 w-4" />
            Crear Grupo
          </Button>

          {filtered.map((g) => (
            <Card
              key={g.id}
              className="flex cursor-pointer items-center gap-3.5 p-4 transition-colors hover:bg-muted/50 active:bg-muted/70"
              onClick={() => router.push(`/admin/grupos/${g.id}`)}
            >
              <Avatar className="h-11 w-11 rounded-xl">
                <AvatarFallback className={`rounded-xl text-xs font-bold ${g.color}`}>
                  {g.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-foreground">{g.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  Propietario: {g.owner}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <Users className="h-3 w-3" />
                  {g.memberCount}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Layers className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No se encontraron grupos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
