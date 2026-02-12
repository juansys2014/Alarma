"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Phone,
  XCircle,
  CheckCircle2,
  Compass,
  Loader2,
  AlertTriangle,
  Lock,
  Check,
  Navigation,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type ResponseStatus = "none" | "received" | "going"

const MOCK_ALERT = {
  id: "ALR-0042",
  status: "active" as "active" | "cancelled",
  user: {
    name: "Carlos Mendez",
    email: "carlos@ejemplo.com",
    initials: "CM",
  },
  timestamp: "2026-02-12T14:32:00",
  address: "Av. Insurgentes Sur 1602, Col. Credito Constructor",
  city: "Ciudad de Mexico, CDMX",
  coords: { lat: 19.3712, lng: -99.1741 },
  accuracy: 12,
  group: "Familia Mendez",
}

const MOCK_PIN = "1234"

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function timeSince(iso: string) {
  const now = new Date()
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "Hace unos segundos"
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  return `Hace ${hrs}h ${mins % 60}m`
}

// --- Sub-components ---

function StatusBadge({ status }: { status: "active" | "cancelled" }) {
  if (status === "active") {
    return (
      <Badge
        variant="destructive"
        className="h-5 px-1.5 text-[10px] font-medium uppercase tracking-wide"
      >
        Activa
      </Badge>
    )
  }
  return (
    <Badge
      variant="secondary"
      className="h-5 px-1.5 text-[10px] font-medium uppercase tracking-wide"
    >
      Cancelada
    </Badge>
  )
}

function ActivePulse() {
  return (
    <div className="flex items-center justify-center py-3">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-destructive/20 animate-ping" />
        <span className="absolute inline-flex h-7 w-7 rounded-full bg-destructive/30 animate-pulse" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-destructive" />
      </div>
    </div>
  )
}

function UserInfoCard({ alert }: { alert: typeof MOCK_ALERT }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-xl border-2 border-destructive/20">
            <AvatarFallback className="rounded-xl bg-destructive/10 text-sm font-semibold text-destructive">
              {alert.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {alert.user.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {alert.user.email}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-foreground">
              {formatTime(alert.timestamp)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {timeSince(alert.timestamp)}
            </p>
          </div>
        </div>
        <div className="mt-3 border-t pt-3">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Fecha
          </p>
          <p className="text-xs capitalize text-foreground">
            {formatDate(alert.timestamp)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function LocationCard({ alert }: { alert: typeof MOCK_ALERT }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Ubicacion
            </p>
            <p className="text-sm font-medium leading-snug text-foreground">
              {alert.address}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{alert.city}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Coordenadas
            </p>
            <p className="font-mono text-xs text-foreground">
              {alert.coords.lat.toFixed(4)}, {alert.coords.lng.toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Precision
            </p>
            <div className="flex items-center justify-end gap-1">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  alert.accuracy <= 15
                    ? "bg-[hsl(var(--success))]"
                    : alert.accuracy <= 50
                      ? "bg-amber-500"
                      : "bg-destructive"
                }`}
              />
              <p className="font-mono text-xs text-foreground">
                {alert.accuracy}m
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MapPlaceholder({ alert }: { alert: typeof MOCK_ALERT }) {
  return (
    <Card className="overflow-hidden">
      <div
        className="relative flex h-48 flex-col items-center justify-center bg-muted"
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Center pin */}
        <div className="relative z-[1] flex flex-col items-center">
          <div className="relative">
            <span className="absolute -inset-3 animate-pulse rounded-full bg-destructive/10" />
            <MapPin className="relative z-[1] h-7 w-7 text-destructive" fill="hsl(var(--destructive))" />
          </div>
          <p className="mt-3 text-[10px] font-medium text-muted-foreground">
            Mapa no disponible en modo demo
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {alert.coords.lat.toFixed(4)}, {alert.coords.lng.toFixed(4)}
          </p>
        </div>

        {/* Accuracy ring */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-destructive/20" />
      </div>
    </Card>
  )
}

function ResponseButtons({
  responseStatus,
  onResponse,
  onCall,
  onCancel,
}: {
  responseStatus: ResponseStatus
  onResponse: (status: ResponseStatus) => void
  onCall: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-lg px-5 pb-8 pt-3">
        {/* Top row */}
        <div className="mb-2 grid grid-cols-2 gap-2">
          <Button
            variant={responseStatus === "received" ? "default" : "outline"}
            className={`h-11 gap-2 text-sm font-medium ${
              responseStatus === "received"
                ? "border-transparent text-[hsl(var(--success-foreground))]"
                : ""
            }`}
            style={
              responseStatus === "received"
                ? { backgroundColor: "hsl(var(--success))" }
                : undefined
            }
            onClick={() =>
              onResponse(responseStatus === "received" ? "none" : "received")
            }
          >
            <Check className="h-4 w-4" />
            Recibido
          </Button>

          <Button
            variant={responseStatus === "going" ? "default" : "outline"}
            className={`h-11 gap-2 text-sm font-medium ${
              responseStatus === "going"
                ? "border-transparent bg-foreground text-background hover:bg-foreground/90"
                : ""
            }`}
            onClick={() =>
              onResponse(responseStatus === "going" ? "none" : "going")
            }
          >
            <Navigation className="h-4 w-4" />
            Estoy yendo
          </Button>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 text-sm font-medium"
            onClick={onCall}
          >
            <Phone className="h-4 w-4" />
            Llamar
          </Button>

          <Button
            variant="outline"
            className="h-11 gap-2 text-sm font-medium border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={onCancel}
          >
            <XCircle className="h-4 w-4" />
            Cancelar
          </Button>
        </div>

        {/* Response confirmation */}
        {responseStatus !== "none" && (
          <div
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium"
            style={
              responseStatus === "received"
                ? {
                    backgroundColor: "hsl(var(--success) / 0.1)",
                    color: "hsl(var(--success))",
                  }
                : {
                    backgroundColor: "hsl(var(--foreground) / 0.05)",
                    color: "hsl(var(--foreground))",
                  }
            }
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {responseStatus === "received"
              ? "Has confirmado recibir la alerta"
              : "Has indicado que vas en camino"}
          </div>
        )}
      </div>
    </div>
  )
}

function CancelPinDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [pin, setPin] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState(false)

  const handleVerify = useCallback(() => {
    setVerifying(true)
    setError(false)
    setTimeout(() => {
      if (pin === MOCK_PIN) {
        onSuccess()
        setPin("")
        setVerifying(false)
        onOpenChange(false)
      } else {
        setError(true)
        setVerifying(false)
        setPin("")
      }
    }, 1200)
  }, [pin, onSuccess, onOpenChange])

  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (!v) {
        setPin("")
        setError(false)
        setVerifying(false)
      }
      onOpenChange(v)
    },
    [onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="mx-4 max-w-sm rounded-2xl">
        <DialogHeader className="items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Cancelar Alerta</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Ingresa el PIN del grupo para confirmar la cancelacion
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(v) => {
              setPin(v)
              setError(false)
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className={error ? "border-destructive" : ""}
              />
              <InputOTPSlot
                index={1}
                className={error ? "border-destructive" : ""}
              />
              <InputOTPSlot
                index={2}
                className={error ? "border-destructive" : ""}
              />
              <InputOTPSlot
                index={3}
                className={error ? "border-destructive" : ""}
              />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-xs font-medium text-destructive">
              PIN incorrecto. Intenta de nuevo.
            </p>
          )}

          <div className="flex w-full flex-col gap-2">
            <Button
              variant="destructive"
              className="h-11 w-full font-medium"
              disabled={pin.length < 4 || verifying}
              onClick={handleVerify}
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Confirmar cancelacion"
              )}
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-full text-sm text-muted-foreground"
              onClick={() => handleOpenChange(false)}
              disabled={verifying}
            >
              Volver
            </Button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            PIN de prueba: 1234
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CallingDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: typeof MOCK_ALERT.user
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-sm rounded-2xl">
        <DialogHeader className="items-center">
          <div className="mb-2">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarFallback className="rounded-xl bg-muted text-lg font-semibold text-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-center">
            Llamar a {user.name}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            Se abrira la aplicacion de telefono de tu dispositivo
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            className="h-11 w-full font-medium"
            style={{
              backgroundColor: "hsl(var(--success))",
              color: "hsl(var(--success-foreground))",
            }}
          >
            <Phone className="h-4 w-4" />
            Llamar ahora
          </Button>
          <Button
            variant="ghost"
            className="h-10 w-full text-sm text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Component ---

export function AlertDetailScreen() {
  const navigate = useNavigate()
  const [alert, setAlert] = useState(MOCK_ALERT)
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>("none")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState(false)

  const handleCancelSuccess = useCallback(() => {
    setAlert((prev) => ({ ...prev, status: "cancelled" as const }))
    setResponseStatus("none")
  }, [])

  const isActive = alert.status === "active"

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
                Alerta {alert.id}
              </h1>
              <StatusBadge status={alert.status} />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {alert.group}
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div
        className={`flex-1 px-5 pt-4 ${isActive ? "pb-44" : "pb-8"}`}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {/* Active pulse indicator */}
          {isActive && <ActivePulse />}

          {/* Cancelled banner */}
          {!isActive && (
            <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background">
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Alerta cancelada
                </p>
                <p className="text-xs text-muted-foreground">
                  Esta alerta fue cancelada con PIN
                </p>
              </div>
            </div>
          )}

          {/* User info */}
          <UserInfoCard alert={alert} />

          {/* Location */}
          <LocationCard alert={alert} />

          {/* Map placeholder */}
          <MapPlaceholder alert={alert} />
        </div>
      </div>

      {/* Action buttons - only when active */}
      {isActive && (
        <ResponseButtons
          responseStatus={responseStatus}
          onResponse={setResponseStatus}
          onCall={() => setShowCallDialog(true)}
          onCancel={() => setShowCancelDialog(true)}
        />
      )}

      {/* Cancel PIN dialog */}
      <CancelPinDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onSuccess={handleCancelSuccess}
      />

      {/* Call dialog */}
      <CallingDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        user={alert.user}
      />
    </div>
  )
}
