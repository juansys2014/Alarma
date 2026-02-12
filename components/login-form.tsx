"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Step = "email" | "otp"
type Status = "idle" | "loading" | "success" | "error"

export function LoginForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSendCode = useCallback(async () => {
    if (!isValidEmail) return
    setStatus("loading")
    setErrorMessage("")

    // Mock: simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1800))

    // Mock: 15% chance of error for demo
    if (Math.random() < 0.15) {
      setStatus("error")
      setErrorMessage("No se pudo enviar el codigo. Intenta de nuevo.")
      return
    }

    setStatus("success")
    setTimeout(() => {
      setStep("otp")
      setStatus("idle")
    }, 800)
  }, [isValidEmail])

  const handleVerifyCode = useCallback(async () => {
    if (otp.length !== 6) return
    setStatus("loading")
    setErrorMessage("")

    // Mock: simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock: 20% chance of error for demo
    if (Math.random() < 0.2) {
      setStatus("error")
      setErrorMessage("Codigo incorrecto. Verifica e intenta de nuevo.")
      setOtp("")
      return
    }

    setStatus("success")
    setTimeout(() => {
      navigate("/groups", { replace: true })
    }, 1200)
  }, [otp, navigate])

  const handleResendCode = useCallback(async () => {
    setStatus("loading")
    setErrorMessage("")
    setOtp("")

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("idle")
  }, [])

  const handleBackToEmail = useCallback(() => {
    setStep("email")
    setOtp("")
    setStatus("idle")
    setErrorMessage("")
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        {/* Logo / Icon */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {step === "email" ? "Iniciar sesion" : "Verificar codigo"}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {step === "email"
                ? "Ingresa tu email para recibir un codigo de acceso"
                : (
                    <>
                      {"Enviamos un codigo de 6 digitos a "}
                      <span className="font-medium text-foreground">{email}</span>
                    </>
                  )}
            </p>
          </div>
        </div>

        {/* Email Step */}
        {step === "email" && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === "error") {
                    setStatus("idle")
                    setErrorMessage("")
                  }
                }}
                className="h-12 pl-10 text-base"
                disabled={status === "loading" || status === "success"}
                autoFocus
                aria-label="Correo electronico"
              />
            </div>

            {/* Error message */}
            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success message */}
            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm" style={{ backgroundColor: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }} role="status">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Codigo enviado correctamente</span>
              </div>
            )}

            <Button
              className="h-12 w-full text-base font-medium"
              onClick={handleSendCode}
              disabled={!isValidEmail || status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Codigo enviado</span>
                </>
              ) : (
                <>
                  <span>Enviar codigo</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  if (status === "error") {
                    setStatus("idle")
                    setErrorMessage("")
                  }
                }}
                disabled={status === "loading" || status === "success"}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error message */}
            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success message */}
            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm" style={{ backgroundColor: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }} role="status">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Verificacion exitosa. Redirigiendo...</span>
              </div>
            )}

            <Button
              className="h-12 w-full text-base font-medium"
              onClick={handleVerifyCode}
              disabled={otp.length !== 6 || status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verificado</span>
                </>
              ) : (
                <span>Verificar</span>
              )}
            </Button>

            {/* Footer actions */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={status === "loading" || status === "success"}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                Reenviar codigo
              </button>
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={status === "loading" || status === "success"}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                Cambiar email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
