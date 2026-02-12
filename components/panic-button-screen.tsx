"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useNavigation } from "./app-shell"
import { ArrowLeft, ChevronDown, ShieldAlert, CheckCircle2, Loader2, X, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const MOCK_GROUPS = [
  { id: "1", name: "Equipo de Desarrollo", members: 12 },
  { id: "2", name: "Marketing Digital", members: 8 },
  { id: "3", name: "Soporte Tecnico", members: 5 },
  { id: "4", name: "Recursos Humanos", members: 15 },
]

type PanicState = "idle" | "holding" | "sending" | "sent"

function GroupSelector({
  groups,
  selectedId,
  onSelect,
}: {
  groups: typeof MOCK_GROUPS
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = groups.find((g) => g.id === selectedId)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted/70"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            Grupo seleccionado
          </span>
          <span className="text-sm font-semibold text-foreground">
            {selected?.name}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <Card className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden shadow-lg">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                onSelect(group.id)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                group.id === selectedId ? "bg-muted/60" : ""
              }`}
            >
              <span className="text-sm font-medium text-foreground">
                {group.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {group.members} miembros
              </span>
            </button>
          ))}
        </Card>
      )}
    </div>
  )
}

function PanicRing({
  progress,
  state,
}: {
  progress: number
  state: PanicState
}) {
  const radius = 96
  const strokeWidth = 6
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow when holding */}
      {(state === "holding" || state === "sending") && (
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: "hsl(var(--destructive))" }}
        />
      )}

      {/* SVG ring */}
      <svg
        width={radius * 2}
        height={radius * 2}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          stroke="hsl(var(--border))"
          fill="none"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress */}
        <circle
          stroke={
            state === "sent"
              ? "hsl(var(--success))"
              : "hsl(var(--destructive))"
          }
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: state === "holding" ? "none" : "stroke-dashoffset 0.3s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {state === "sending" ? (
          <Loader2 className="h-10 w-10 animate-spin text-destructive" />
        ) : state === "sent" ? (
          <CheckCircle2 className="h-12 w-12" style={{ color: "hsl(var(--success))" }} />
        ) : (
          <>
            <ShieldAlert
              className={`h-10 w-10 ${
                state === "holding"
                  ? "animate-pulse text-destructive"
                  : "text-muted-foreground"
              }`}
            />
            <span
              className={`mt-2 text-2xl font-black tracking-widest ${
                state === "holding"
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              PANIC
            </span>
          </>
        )}
      </div>
    </div>
  )
}

function CancelPinModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleVerify = () => {
    if (pin.length < 4) {
      setError(true)
      return
    }
    setVerifying(true)
    setError(false)
    setTimeout(() => {
      if (pin === "1234") {
        setVerifying(false)
        setPin("")
        onConfirm()
      } else {
        setVerifying(false)
        setError(true)
        setPin("")
      }
    }, 1200)
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setPin("")
      setError(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="mx-4 max-w-sm rounded-2xl">
        <DialogHeader className="items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Cancelar Alerta</DialogTitle>
          <DialogDescription className="text-center">
            Ingresa el PIN del grupo para confirmar la cancelacion
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <InputOTP
            maxLength={6}
            value={pin}
            onChange={(val) => {
              setPin(val)
              setError(false)
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-xs font-medium text-destructive">
              PIN incorrecto. Intenta de nuevo.
            </p>
          )}

          <div className="flex w-full flex-col gap-2">
            <Button
              onClick={handleVerify}
              disabled={pin.length < 4 || verifying}
              variant="destructive"
              className="h-11 w-full font-medium"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Confirmar Cancelacion"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="h-11 w-full text-muted-foreground"
            >
              Volver
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            PIN de prueba: 1234
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PanicButtonScreen() {
  const { goBack } = useNavigation()
  const [selectedGroup, setSelectedGroup] = useState(MOCK_GROUPS[0].id)
  const [panicState, setPanicState] = useState<PanicState>("idle")
  const [holdProgress, setHoldProgress] = useState(0)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartRef = useRef<number | null>(null)
  const HOLD_DURATION = 3000

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
      holdTimerRef.current = null
    }
    holdStartRef.current = null
  }, [])

  const startHold = useCallback(() => {
    if (panicState !== "idle") return
    setPanicState("holding")
    holdStartRef.current = Date.now()

    holdTimerRef.current = setInterval(() => {
      if (!holdStartRef.current) return
      const elapsed = Date.now() - holdStartRef.current
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setHoldProgress(pct)

      if (pct >= 100) {
        clearHoldTimer()
        setPanicState("sending")
        // Simulate sending
        setTimeout(() => {
          setPanicState("sent")
          setHoldProgress(100)
        }, 2000)
      }
    }, 16)
  }, [panicState, clearHoldTimer])

  const cancelHold = useCallback(() => {
    if (panicState !== "holding") return
    clearHoldTimer()
    setPanicState("idle")
    setHoldProgress(0)
  }, [panicState, clearHoldTimer])

  const handleReset = () => {
    setPanicState("idle")
    setHoldProgress(0)
  }

  const handleCancelAlert = () => {
    setCancelModalOpen(false)
    setPanicState("idle")
    setHoldProgress(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => clearHoldTimer()
  }, [clearHoldTimer])

  const selectedGroupData = MOCK_GROUPS.find((g) => g.id === selectedGroup)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Volver"
            onClick={goBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Boton de Panico
            </h1>
            <p className="text-xs text-muted-foreground">
              Alerta de emergencia
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6">
          {/* Group selector */}
          <GroupSelector
            groups={MOCK_GROUPS}
            selectedId={selectedGroup}
            onSelect={setSelectedGroup}
          />

          {/* Status badge */}
          <div className="flex justify-center">
            {panicState === "idle" && (
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                En espera
              </Badge>
            )}
            {panicState === "holding" && (
              <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-xs font-medium animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground" />
                Mantener presionado...
              </Badge>
            )}
            {panicState === "sending" && (
              <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-xs font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                Enviando alerta...
              </Badge>
            )}
            {panicState === "sent" && (
              <Badge
                className="gap-1.5 border-transparent px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "hsl(var(--success))",
                  color: "hsl(var(--success-foreground))",
                }}
              >
                <CheckCircle2 className="h-3 w-3" />
                Alerta enviada
              </Badge>
            )}
          </div>

          {/* Panic button area */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <button
              type="button"
              onPointerDown={panicState === "idle" ? startHold : undefined}
              onPointerUp={panicState === "holding" ? cancelHold : undefined}
              onPointerLeave={panicState === "holding" ? cancelHold : undefined}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative select-none touch-none rounded-full outline-none transition-transform ${
                panicState === "idle"
                  ? "cursor-pointer active:scale-95"
                  : panicState === "holding"
                    ? "scale-105 cursor-pointer"
                    : "cursor-default"
              }`}
              disabled={panicState === "sending"}
              aria-label="Boton de panico - mantener presionado 3 segundos para activar"
            >
              <PanicRing progress={holdProgress} state={panicState} />
            </button>

            {/* Instructions */}
            {panicState === "idle" && (
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Manten presionado el boton durante
                <br />
                <span className="font-semibold text-foreground">3 segundos</span> para enviar la alerta
              </p>
            )}
            {panicState === "holding" && (
              <p className="text-center text-sm font-medium text-destructive animate-pulse">
                Sigue presionando... {Math.ceil((100 - holdProgress) / 100 * 3)}s
              </p>
            )}
            {panicState === "sending" && (
              <p className="text-center text-sm text-muted-foreground">
                Notificando a {selectedGroupData?.members} miembros de{" "}
                <span className="font-medium text-foreground">{selectedGroupData?.name}</span>
              </p>
            )}
            {panicState === "sent" && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-center text-sm font-medium text-foreground">
                  Alerta enviada exitosamente
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  {selectedGroupData?.members} miembros notificados
                </p>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="mx-auto flex w-full max-w-xs flex-col gap-3 pb-4">
            {panicState === "sent" && (
              <>
                <Button
                  variant="destructive"
                  className="h-12 w-full text-base font-medium"
                  onClick={() => setCancelModalOpen(true)}
                >
                  <X className="h-5 w-5" />
                  Cancelar Alerta
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full font-medium"
                  onClick={handleReset}
                >
                  Volver al inicio
                </Button>
              </>
            )}
            {panicState === "idle" && (
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  La alerta se enviara a todos los miembros y destinatarios configurados del grupo.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Cancel PIN modal */}
      <CancelPinModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelAlert}
      />
    </div>
  )
}
