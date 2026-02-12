"use client"

import { useState, useMemo, useCallback } from "react"
import { useNavigation } from "./app-shell"
import {
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Send,
  Loader2,
  Mail,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// -- Types --

interface Contact {
  id: string
  name: string
  email: string
  initials: string
  online: boolean
}

interface PendingRequest {
  id: string
  name: string
  email: string
  initials: string
  direction: "sent" | "received"
  timestamp: string
}

// -- Mock data --

const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "Carlos Garcia", email: "carlos@email.com", initials: "CG", online: true },
  { id: "2", name: "Maria Lopez", email: "maria@email.com", initials: "ML", online: true },
  { id: "3", name: "Juan Martinez", email: "juan@email.com", initials: "JM", online: false },
  { id: "4", name: "Ana Torres", email: "ana@email.com", initials: "AT", online: true },
  { id: "5", name: "Pedro Ruiz", email: "pedro@email.com", initials: "PR", online: false },
  { id: "6", name: "Sofia Herrera", email: "sofia@email.com", initials: "SH", online: true },
  { id: "7", name: "Diego Morales", email: "diego@email.com", initials: "DM", online: false },
]

const MOCK_PENDING: PendingRequest[] = [
  { id: "p1", name: "Laura Jimenez", email: "laura@email.com", initials: "LJ", direction: "received", timestamp: "Hace 2 horas" },
  { id: "p2", name: "Roberto Vega", email: "roberto@email.com", initials: "RV", direction: "received", timestamp: "Hace 1 dia" },
  { id: "p3", name: "Elena Rios", email: "elena@email.com", initials: "ER", direction: "sent", timestamp: "Hace 3 horas" },
  { id: "p4", name: "Fernando Diaz", email: "fernando@email.com", initials: "FD", direction: "sent", timestamp: "Hace 5 horas" },
]

// -- Sub-components --

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card className="flex items-center gap-3 p-3.5">
      <div className="relative">
        <Avatar className="h-10 w-10 rounded-xl">
          <AvatarFallback className="rounded-xl bg-muted text-xs font-semibold text-foreground">
            {contact.initials}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
            contact.online ? "bg-[hsl(var(--success))]" : "bg-muted-foreground/40"
          }`}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {contact.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {contact.email}
        </span>
      </div>

      <Badge
        variant="secondary"
        className={`h-5 shrink-0 px-1.5 text-[10px] font-medium ${
          contact.online
            ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
            : ""
        }`}
      >
        {contact.online ? "En linea" : "Desconectado"}
      </Badge>
    </Card>
  )
}

function PendingCard({
  request,
  onAccept,
  onReject,
}: {
  request: PendingRequest
  onAccept?: () => void
  onReject?: () => void
}) {
  return (
    <Card className="flex items-center gap-3 p-3.5">
      <Avatar className="h-10 w-10 shrink-0 rounded-xl">
        <AvatarFallback className="rounded-xl bg-muted text-xs font-semibold text-foreground">
          {request.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {request.name}
        </span>
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="h-4 px-1 text-[9px] font-medium text-muted-foreground"
          >
            {request.direction === "sent" ? "Enviada" : "Recibida"}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {request.timestamp}
          </span>
        </div>
      </div>

      {request.direction === "received" ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label="Rechazar solicitud"
            onClick={onReject}
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10 hover:text-[hsl(var(--success))]"
            aria-label="Aceptar solicitud"
            onClick={onAccept}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Badge variant="secondary" className="h-5 shrink-0 gap-1 px-1.5 text-[10px] font-medium">
          <Clock className="h-2.5 w-2.5" />
          Pendiente
        </Badge>
      )}
    </Card>
  )
}

function SearchResultCard({
  email,
  onSend,
  isSending,
  isSent,
}: {
  email: string
  onSend: () => void
  isSending: boolean
  isSent: boolean
}) {
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <Card className="flex items-center gap-3 border-dashed p-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Mail className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {email}
        </span>
        <span className="text-xs text-muted-foreground">
          Usuario encontrado
        </span>
      </div>

      {isSent ? (
        <Badge
          variant="secondary"
          className="h-7 shrink-0 gap-1 px-2 text-xs font-medium bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
        >
          <CheckCircle2 className="h-3 w-3" />
          Enviada
        </Badge>
      ) : (
        <Button
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-3 text-xs font-medium"
          onClick={onSend}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <UserPlus className="h-3 w-3" />
          )}
          {isSending ? "Enviando" : "Agregar"}
        </Button>
      )}
    </Card>
  )
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

// -- Main component --

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ContactsScreen() {
  const { goBack } = useNavigation()
  const [activeTab, setActiveTab] = useState<string>("contactos")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<Set<string>>(new Set())

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CONTACTS
    const q = searchQuery.toLowerCase()
    return MOCK_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const receivedRequests = MOCK_PENDING.filter((r) => r.direction === "received")
  const sentRequests = MOCK_PENDING.filter((r) => r.direction === "sent")
  const pendingCount = MOCK_PENDING.length

  const showSearchResult =
    searchQuery.trim().length > 0 &&
    isValidEmail(searchQuery) &&
    !MOCK_CONTACTS.some((c) => c.email.toLowerCase() === searchQuery.toLowerCase())

  const handleSendRequest = useCallback(
    (email: string) => {
      setSendingTo(email)
      setTimeout(() => {
        setSendingTo(null)
        setSentTo((prev) => new Set(prev).add(email))
      }, 1200)
    },
    []
  )

  const onlineCount = MOCK_CONTACTS.filter((c) => c.online).length

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
              onClick={goBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex min-w-0 flex-1 flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Contactos
              </h1>
              <p className="text-xs text-muted-foreground">
                {MOCK_CONTACTS.length} contactos{" "}
                <span className="text-[hsl(var(--success))]">
                  ({onlineCount} en linea)
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="border-b bg-background px-5 pb-3 pt-3">
        <div className="mx-auto w-full max-w-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              inputMode="email"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-11 rounded-xl bg-muted/50 pl-10 pr-10 text-sm"
              aria-label="Buscar contacto"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Limpiar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-background/95 px-5 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid h-11 w-full grid-cols-2 bg-muted/60">
              <TabsTrigger
                value="contactos"
                className="flex items-center gap-1.5 text-xs data-[state=active]:text-foreground"
              >
                <Users className="h-3.5 w-3.5" />
                Contactos
                <Badge
                  variant="secondary"
                  className="ml-0.5 h-4 min-w-[18px] px-1 text-[9px] font-semibold"
                >
                  {MOCK_CONTACTS.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pendientes"
                className="flex items-center gap-1.5 text-xs data-[state=active]:text-foreground"
              >
                <Clock className="h-3.5 w-3.5" />
                Pendientes
                {pendingCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-0.5 h-4 min-w-[18px] px-1 text-[9px] font-semibold"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 pt-4">
        <div className="mx-auto w-full max-w-lg">
          {/* Send request result when searching email not in contacts */}
          {showSearchResult && (
            <div className="mb-4 flex flex-col gap-2">
              <p className="px-1 text-xs font-medium text-muted-foreground">
                Enviar solicitud de contacto
              </p>
              <SearchResultCard
                email={searchQuery}
                onSend={() => handleSendRequest(searchQuery)}
                isSending={sendingTo === searchQuery}
                isSent={sentTo.has(searchQuery)}
              />
            </div>
          )}

          {/* Active contacts tab */}
          {activeTab === "contactos" && (
            <div className="flex flex-col gap-3">
              {filteredContacts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {searchQuery.trim()
                        ? `${filteredContacts.length} resultado${filteredContacts.length !== 1 ? "s" : ""}`
                        : "Todos los contactos"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {filteredContacts.map((contact) => (
                      <ContactCard key={contact.id} contact={contact} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={Search}
                  title="Sin resultados"
                  description={
                    isValidEmail(searchQuery)
                      ? "Este email no esta en tus contactos. Puedes enviar una solicitud."
                      : "No se encontraron contactos con ese criterio de busqueda."
                  }
                />
              )}
            </div>
          )}

          {/* Pending requests tab */}
          {activeTab === "pendientes" && (
            <div className="flex flex-col gap-5">
              {/* Received */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 px-1">
                  <p className="text-xs font-semibold text-foreground">Recibidas</p>
                  <Badge
                    variant="secondary"
                    className="h-4 min-w-[18px] px-1 text-[9px] font-semibold"
                  >
                    {receivedRequests.length}
                  </Badge>
                </div>
                {receivedRequests.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {receivedRequests.map((req) => (
                      <PendingCard key={req.id} request={req} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={UserPlus}
                    title="Sin solicitudes recibidas"
                    description="Cuando alguien te envie una solicitud de contacto aparecera aqui."
                  />
                )}
              </div>

              {/* Sent */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 px-1">
                  <p className="text-xs font-semibold text-foreground">Enviadas</p>
                  <Badge
                    variant="secondary"
                    className="h-4 min-w-[18px] px-1 text-[9px] font-semibold"
                  >
                    {sentRequests.length}
                  </Badge>
                </div>
                {sentRequests.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {sentRequests.map((req) => (
                      <PendingCard key={req.id} request={req} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Send}
                    title="Sin solicitudes enviadas"
                    description="Las solicitudes que envies apareceras aqui mientras esperan respuesta."
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
