"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  ArrowLeft,
  Users,
  Send,
  Smartphone,
  Clock,
  UserPlus,
  Settings,
  MoreVertical,
  Shield,
  Crown,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// -- Mock data --

interface Member {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Miembro"
  initials: string
  online: boolean
}

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Carlos Garcia", email: "carlos@email.com", role: "Owner", initials: "CG", online: true },
  { id: "2", name: "Maria Lopez", email: "maria@email.com", role: "Admin", initials: "ML", online: true },
  { id: "3", name: "Juan Martinez", email: "juan@email.com", role: "Miembro", initials: "JM", online: false },
  { id: "4", name: "Ana Torres", email: "ana@email.com", role: "Miembro", initials: "AT", online: true },
  { id: "5", name: "Pedro Ruiz", email: "pedro@email.com", role: "Miembro", initials: "PR", online: false },
  { id: "6", name: "Sofia Herrera", email: "sofia@email.com", role: "Miembro", initials: "SH", online: false },
]

interface Recipient {
  id: string
  name: string
  type: "Email" | "SMS" | "Webhook"
  value: string
  active: boolean
}

const MOCK_RECIPIENTS: Recipient[] = [
  { id: "1", name: "Alertas equipo", type: "Email", value: "equipo@empresa.com", active: true },
  { id: "2", name: "Notificacion SMS", type: "SMS", value: "+52 55 1234 5678", active: true },
  { id: "3", name: "Webhook Slack", type: "Webhook", value: "https://hooks.slack.com/...", active: false },
  { id: "4", name: "Reportes admin", type: "Email", value: "admin@empresa.com", active: true },
]

interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "warning"
  lastSeen: string
}

const MOCK_DEVICES: Device[] = [
  { id: "1", name: "Sensor Puerta Principal", type: "Sensor", status: "online", lastSeen: "Ahora" },
  { id: "2", name: "Camara Estacionamiento", type: "Camara", status: "online", lastSeen: "Ahora" },
  { id: "3", name: "Detector Humo Piso 2", type: "Detector", status: "warning", lastSeen: "Hace 5 min" },
  { id: "4", name: "Sensor Ventana Oficina", type: "Sensor", status: "offline", lastSeen: "Hace 2 horas" },
]

interface HistoryEntry {
  id: string
  action: string
  user: string
  timestamp: string
  type: "success" | "error" | "info"
}

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "1", action: "Alerta enviada a equipo@empresa.com", user: "Sistema", timestamp: "Hoy, 14:32", type: "success" },
  { id: "2", action: "Dispositivo desconectado: Sensor Ventana", user: "Sistema", timestamp: "Hoy, 12:15", type: "error" },
  { id: "3", action: "Maria Lopez se unio al grupo", user: "Maria Lopez", timestamp: "Ayer, 09:40", type: "info" },
  { id: "4", action: "Configuracion de destinatarios actualizada", user: "Carlos Garcia", timestamp: "Ayer, 08:20", type: "info" },
  { id: "5", action: "Alerta enviada via SMS", user: "Sistema", timestamp: "12 Feb, 22:10", type: "success" },
  { id: "6", action: "Webhook Slack desactivado", user: "Carlos Garcia", timestamp: "11 Feb, 16:45", type: "error" },
]

// -- Sub-components per tab --

function RoleIcon({ role }: { role: Member["role"] }) {
  if (role === "Owner") return <Crown className="h-3 w-3" />
  if (role === "Admin") return <Shield className="h-3 w-3" />
  return null
}

function roleBadgeVariant(role: Member["role"]): "default" | "secondary" | "outline" {
  if (role === "Owner") return "default"
  if (role === "Admin") return "secondary"
  return "outline"
}

function MembersTab({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Button className="h-11 w-full text-sm font-medium" onClick={onInvite}>
        <UserPlus className="h-4 w-4" />
        Invitar Miembro
      </Button>

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {MOCK_MEMBERS.length} miembros
        </p>
        <p className="text-xs text-muted-foreground">
          {MOCK_MEMBERS.filter((m) => m.online).length} en linea
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {MOCK_MEMBERS.map((member) => (
          <Card
            key={member.id}
            className="flex items-center gap-3 p-3.5"
          >
            <div className="relative">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarFallback className="rounded-xl bg-muted text-xs font-semibold text-foreground">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                  member.online ? "bg-[hsl(var(--success))]" : "bg-muted-foreground/40"
                }`}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {member.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {member.email}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant={roleBadgeVariant(member.role)}
                className="h-5 gap-1 px-1.5 text-[10px] font-medium"
              >
                <RoleIcon role={member.role} />
                {member.role}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label={`Opciones de ${member.name}`}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function recipientTypeIcon(type: Recipient["type"]) {
  if (type === "Email") return "mail"
  if (type === "SMS") return "sms"
  return "hook"
}

function RecipientsTab() {
  return (
    <div className="flex flex-col gap-3">
      <Button className="h-11 w-full text-sm font-medium">
        <Settings className="h-4 w-4" />
        Configurar Destinatarios
      </Button>

      <p className="text-xs font-medium text-muted-foreground">
        {MOCK_RECIPIENTS.length} destinatarios configurados
      </p>

      <div className="flex flex-col gap-2">
        {MOCK_RECIPIENTS.map((recipient) => (
          <Card
            key={recipient.id}
            className="flex items-center gap-3 p-3.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Send className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {recipient.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {recipient.value}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-medium"
              >
                {recipient.type}
              </Badge>
              <span
                className={`h-2 w-2 rounded-full ${
                  recipient.active ? "bg-[hsl(var(--success))]" : "bg-muted-foreground/40"
                }`}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function deviceStatusIcon(status: Device["status"]) {
  if (status === "online") return <Wifi className="h-4 w-4 text-[hsl(var(--success))]" />
  if (status === "warning") return <AlertCircle className="h-4 w-4 text-amber-500" />
  return <WifiOff className="h-4 w-4 text-muted-foreground/50" />
}

function deviceStatusLabel(status: Device["status"]) {
  if (status === "online") return "En linea"
  if (status === "warning") return "Advertencia"
  return "Desconectado"
}

function deviceStatusColor(status: Device["status"]) {
  if (status === "online") return "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
  if (status === "warning") return "bg-amber-500/10 text-amber-600"
  return "bg-muted text-muted-foreground"
}

function DevicesTab() {
  const onlineCount = MOCK_DEVICES.filter((d) => d.status === "online").length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {MOCK_DEVICES.length} dispositivos
        </p>
        <p className="text-xs text-muted-foreground">
          {onlineCount} en linea
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {MOCK_DEVICES.map((device) => (
          <Card
            key={device.id}
            className="flex items-center gap-3 p-3.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {device.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {device.lastSeen}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="secondary"
                className={`h-5 gap-1 px-1.5 text-[10px] font-medium ${deviceStatusColor(device.status)}`}
              >
                {deviceStatusIcon(device.status)}
                {deviceStatusLabel(device.status)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function historyIcon(type: HistoryEntry["type"]) {
  if (type === "success") return <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
  if (type === "error") return <XCircle className="h-4 w-4 text-destructive" />
  return <AlertCircle className="h-4 w-4 text-muted-foreground" />
}

function HistoryTab() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground">
        Actividad reciente
      </p>

      <div className="flex flex-col gap-2">
        {MOCK_HISTORY.map((entry) => (
          <Card
            key={entry.id}
            className="flex items-start gap-3 p-3.5"
          >
            <div className="mt-0.5 shrink-0">
              {historyIcon(entry.type)}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm leading-snug text-foreground">
                {entry.action}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {entry.user}
                </span>
                <span className="text-xs text-muted-foreground/50">
                  {"·"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.timestamp}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// -- Main component --

const TAB_CONFIG = [
  { value: "miembros", label: "Miembros", icon: Users },
  { value: "destinatarios", label: "Destinos", icon: Send },
  { value: "dispositivos", label: "Equipos", icon: Smartphone },
  { value: "historial", label: "Historial", icon: Clock },
] as const

export function GroupDetail() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>("miembros")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
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
            <div className="flex min-w-0 flex-1 flex-col">
              <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
                Equipo de Desarrollo
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-5 px-1.5 text-[10px] font-medium">
                  Admin
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {MOCK_MEMBERS.length} miembros
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground"
              aria-label="Mas opciones"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[105px] z-10 border-b bg-background/95 px-5 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid h-11 w-full grid-cols-4 bg-muted/60">
              {TAB_CONFIG.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 text-xs data-[state=active]:text-foreground"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-5 pb-8 pt-4">
        <div className="mx-auto w-full max-w-lg">
          {activeTab === "miembros" && <MembersTab onInvite={() => router.push(`${pathname}/invitar`)} />}
          {activeTab === "destinatarios" && <RecipientsTab />}
          {activeTab === "dispositivos" && <DevicesTab />}
          {activeTab === "historial" && <HistoryTab />}
        </div>
      </div>
    </div>
  )
}
