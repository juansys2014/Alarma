"use client"

import { useState, useCallback } from "react"
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

function AlertHeader({
  alert,
}: {
  alert: typeof MOCK_ALERT
}) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground"
          aria-label="Volver"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-foreground truncate">
              Alerta {alert.id}
            </h1>
            <StatusBadge status={alert.status} />
          </div>
          <p className="text-xs text-muted-foreground truncate">{alert.group}</p>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: "active" | "cancelled" }) {
  if (status === "active") {
    return (
      <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px] px-1.5 py-0 font-medium uppercase tracking-wide">
        Activa
      </Badge>
    )
  }
  return (
    <Badge className="bg-muted text-muted-foreground border-border text-[10px] px-1.5 py-0 font-medium uppercase tracking-wide">
      Cancelada
    </Badge>
  )
}

function ActivePulse() {
  return (
    <div className="flex items-center justify-center py-3">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-red-400/20 animate-ping" />
        <span className="absolute inline-flex h-7 w-7 rounded-full bg-red-400/30 animate-pulse" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
      </div>
    </div>
  )
}

function UserInfoCard({ alert }: { alert: typeof MOCK_ALERT }) {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-red-200">
            <AvatarFallback className="bg-red-50 text-red-600 text-sm font-semibold">
              {alert.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{alert.user.name}</p>
            <p className="text-xs text-muted-foreground">{alert.user.email}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-medium text-foreground">
              {formatTime(alert.timestamp)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {timeSince(alert.timestamp)}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Fecha
          </p>
          <p className="text-xs text-foreground capitalize">
            {formatDate(alert.timestamp)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function LocationCard({ alert }: { alert: typeof MOCK_ALERT }) {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary shrink-0 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Ubicacion
            </p>
            <p className="text-sm font-medium text-foreground leading-snug">
              {alert.address}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{alert.city}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
              Coordenadas
            </p>
            <p className="text-xs text-foreground font-mono">
              {alert.coords.lat.toFixed(4)}, {alert.coords.lng.toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
              Precision
            </p>
            <div className="flex items-center gap-1 justify-end">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${alert.accuracy <= 15 ? "bg-emerald-500" : alert.accuracy <= 50 ? "bg-amber-500" : "bg-red-500"}`} />
              <p className="text-xs text-foreground font-mono">
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
    <Card className="border-border shadow-none overflow-hidden">
      <div className="relative bg-secondary h-48 flex flex-col items-center justify-center">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        {/* Center pin */}
        <div className="relative z-[1] flex flex-col items-center">
          <div className="relative">
            <span className="absolute -inset-3 rounded-full bg-red-500/10 animate-pulse" />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-[1]">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="hsl(0 72% 51%)" stroke="hsl(0 72% 51%)" strokeWidth="1" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 font-medium">
            Mapa no disponible en modo demo
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {alert.coords.lat.toFixed(4)}, {alert.coords.lng.toFixed(4)}
          </p>
        </div>

        {/* Accuracy ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-dashed border-red-300/40 pointer-events-none" />
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
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        {/* Top row: Recibido + Estoy yendo */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button
            variant={responseStatus === "received" ? "default" : "outline"}
            className={`h-11 text-sm font-medium gap-2 ${
              responseStatus === "received"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                : "border-border text-foreground hover:bg-secondary"
            }`}
            onClick={() => onResponse(responseStatus === "received" ? "none" : "received")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {responseStatus === "received" ? (
                <>
                  <path d="M20 6L9 17l-5-5" />
                </>
              ) : (
                <>
                  <path d="M20 6L9 17l-5-5" />
                </>
              )}
            </svg>
            Recibido
          </Button>

          <Button
            variant={responseStatus === "going" ? "default" : "outline"}
            className={`h-11 text-sm font-medium gap-2 ${
              responseStatus === "going"
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "border-border text-foreground hover:bg-secondary"
            }`}
            onClick={() => onResponse(responseStatus === "going" ? "none" : "going")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            Estoy yendo
          </Button>
        </div>

        {/* Bottom row: Llamar + Cancelar */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-11 text-sm font-medium gap-2 border-border text-foreground hover:bg-secondary"
            onClick={onCall}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Llamar
          </Button>

          <Button
            variant="outline"
            className="h-11 text-sm font-medium gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onCancel}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Cancelar
          </Button>
        </div>

        {/* Response confirmation */}
        {responseStatus !== "none" && (
          <div className={`mt-2 rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-medium ${
            responseStatus === "received"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-blue-50 text-blue-700"
          }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
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
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(0 72% 51%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <DialogTitle className="text-center text-base">Cancelar Alerta</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Ingresa el PIN del grupo para confirmar la cancelacion
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(v) => {
              setPin(v)
              setError(false)
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={error ? "border-red-400" : ""} />
              <InputOTPSlot index={1} className={error ? "border-red-400" : ""} />
              <InputOTPSlot index={2} className={error ? "border-red-400" : ""} />
              <InputOTPSlot index={3} className={error ? "border-red-400" : ""} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-xs text-red-600 font-medium">PIN incorrecto. Intenta de nuevo.</p>
          )}

          <p className="text-[10px] text-muted-foreground">PIN de prueba: 1234</p>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
            disabled={pin.length < 4 || verifying}
            onClick={handleVerify}
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verificando...
              </span>
            ) : (
              "Confirmar cancelacion"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full h-10 text-sm text-muted-foreground"
            onClick={() => handleOpenChange(false)}
            disabled={verifying}
          >
            Volver
          </Button>
        </DialogFooter>
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
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarFallback className="bg-secondary text-foreground text-lg font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-center text-base">Llamar a {user.name}</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Se abrira la aplicacion de telefono de tu dispositivo
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Llamar ahora
          </Button>
          <Button
            variant="ghost"
            className="w-full h-10 text-sm text-muted-foreground"
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
    <div className="min-h-dvh bg-background flex flex-col max-w-lg mx-auto">
      <AlertHeader alert={alert} />

      {/* Scrollable content */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 ${isActive ? "pb-44" : "pb-6"}`}>
        {/* Active pulse indicator */}
        {isActive && <ActivePulse />}

        {/* Cancelled banner */}
        {!isActive && (
          <div className="rounded-lg bg-muted px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alerta cancelada</p>
              <p className="text-xs text-muted-foreground">Esta alerta fue cancelada con PIN</p>
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
