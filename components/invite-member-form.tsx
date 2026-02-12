"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, Mail, Shield, User, Send, CheckCircle2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Role = "Admin" | "Miembro"

interface FormState {
  email: string
  role: Role
  emailTouched: boolean
  isSubmitting: boolean
  isSuccess: boolean
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function RoleCard({
  role,
  selected,
  icon: Icon,
  description,
  onSelect,
}: {
  role: Role
  selected: boolean
  icon: React.ElementType
  description: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3.5 rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-foreground bg-foreground/[0.03]"
          : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{role}</span>
        <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
      </div>
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          selected ? "border-foreground bg-foreground" : "border-border"
        }`}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-background"
            />
          </svg>
        )}
      </div>
    </button>
  )
}

function SuccessScreen({ email, role, onReset }: { email: string; role: Role; onReset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--success))]/10">
        <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))]" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Invitacion enviada
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Se envio una invitacion a{" "}
          <span className="font-medium text-foreground">{email}</span>{" "}
          con el rol de{" "}
          <Badge variant="secondary" className="mx-0.5 inline-flex h-5 px-1.5 text-[10px] font-medium">
            {role}
          </Badge>
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2.5">
        <Button className="h-12 w-full text-sm font-semibold" onClick={onReset}>
          <Send className="h-4 w-4" />
          Invitar a otro miembro
        </Button>
        <Button variant="ghost" className="h-10 w-full text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al grupo
        </Button>
      </div>
    </div>
  )
}

export function InviteMemberForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    role: "Miembro",
    emailTouched: false,
    isSubmitting: false,
    isSuccess: false,
  })

  const emailError = form.emailTouched && form.email.length > 0 && !isValidEmail(form.email)
  const emailEmpty = form.emailTouched && form.email.length === 0
  const canSubmit = isValidEmail(form.email) && !form.isSubmitting

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return

    setForm((prev) => ({ ...prev, isSubmitting: true }))
    setTimeout(() => {
      setForm((prev) => ({ ...prev, isSubmitting: false, isSuccess: true }))
    }, 1500)
  }, [canSubmit])

  const handleReset = useCallback(() => {
    setForm({
      email: "",
      role: "Miembro",
      emailTouched: false,
      isSubmitting: false,
      isSuccess: false,
    })
  }, [])

  if (form.isSuccess) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 px-5 pb-4 pt-12 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground"
                aria-label="Volver"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Invitar Miembro
              </h1>
            </div>
          </div>
        </header>
        <SuccessScreen email={form.email} role={form.role} onReset={handleReset} />
      </div>
    )
  }

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
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Invitar Miembro
              </h1>
              <p className="text-xs text-muted-foreground">Equipo de Desarrollo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pb-32 pt-6">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          {/* Email field */}
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <Label htmlFor="invite-email" className="text-sm font-semibold text-foreground">
                  Email del invitado
                </Label>
              </div>

              <Input
                id="invite-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="ejemplo@correo.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                onBlur={() =>
                  setForm((prev) => ({ ...prev, emailTouched: true }))
                }
                className={`h-12 rounded-xl bg-muted/50 text-sm ${
                  emailError || emailEmpty
                    ? "border-destructive focus-visible:ring-destructive"
                    : form.emailTouched && isValidEmail(form.email)
                      ? "border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))]"
                      : ""
                }`}
                aria-invalid={emailError || emailEmpty}
                aria-describedby="email-hint"
              />

              <div id="email-hint" className="min-h-[18px]">
                {emailEmpty && (
                  <p className="text-xs text-destructive">
                    El email es obligatorio
                  </p>
                )}
                {emailError && (
                  <p className="text-xs text-destructive">
                    Ingresa un email valido
                  </p>
                )}
                {form.emailTouched && isValidEmail(form.email) && (
                  <p className="text-xs text-[hsl(var(--success))]">
                    Email valido
                  </p>
                )}
                {!form.emailTouched && (
                  <p className="text-xs text-muted-foreground">
                    Se enviara una invitacion a este correo
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Role selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Label className="text-sm font-semibold text-foreground">
                Seleccionar rol
              </Label>
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground">
                Requerido
              </Badge>
            </div>

            <div className="flex flex-col gap-2.5">
              <RoleCard
                role="Admin"
                selected={form.role === "Admin"}
                icon={Shield}
                description="Puede gestionar miembros, dispositivos y destinatarios del grupo"
                onSelect={() => setForm((prev) => ({ ...prev, role: "Admin" }))}
              />
              <RoleCard
                role="Miembro"
                selected={form.role === "Miembro"}
                icon={User}
                description="Puede ver informacion del grupo y recibir notificaciones"
                onSelect={() => setForm((prev) => ({ ...prev, role: "Miembro" }))}
              />
            </div>
          </div>

          {/* Summary */}
          {isValidEmail(form.email) && (
            <Card className="border-dashed bg-muted/30 p-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Resumen de la invitacion</p>
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">{form.email}</span>
                  <Badge
                    variant="secondary"
                    className="h-5 shrink-0 gap-1 px-1.5 text-[10px] font-medium"
                  >
                    {form.role === "Admin" ? (
                      <Shield className="h-2.5 w-2.5" />
                    ) : (
                      <User className="h-2.5 w-2.5" />
                    )}
                    {form.role}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 px-5 pb-8 pt-4 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <Button
            className="h-12 w-full text-sm font-semibold"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {form.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Invitacion
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
