"use client"

import { useState, useCallback } from "react"
import { useNavigation } from "./app-shell"
import { ArrowLeft, Users, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FormErrors {
  name?: string
  pin?: string
}

export function CreateGroupForm() {
  const { goBack } = useNavigation()
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ name?: boolean; pin?: boolean }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = useCallback(
    (field?: "name" | "pin"): FormErrors => {
      const newErrors: FormErrors = {}

      if (!field || field === "name") {
        if (!name.trim()) {
          newErrors.name = "El nombre del grupo es obligatorio"
        } else if (name.trim().length < 3) {
          newErrors.name = "Minimo 3 caracteres"
        } else if (name.trim().length > 40) {
          newErrors.name = "Maximo 40 caracteres"
        }
      }

      if (!field || field === "pin") {
        if (!pin) {
          newErrors.pin = "El PIN es obligatorio"
        } else if (!/^\d+$/.test(pin)) {
          newErrors.pin = "Solo se permiten numeros"
        } else if (pin.length < 4 || pin.length > 6) {
          newErrors.pin = "El PIN debe tener entre 4 y 6 digitos"
        }
      }

      return newErrors
    },
    [name, pin]
  )

  const handleBlur = (field: "name" | "pin") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = validate(field)
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (touched.name) {
      const fieldErrors = validate("name")
      setErrors((prev) => ({ ...prev, name: undefined, ...( Object.keys(fieldErrors).length ? { name: fieldErrors.name } : {}) }))
    }
  }

  const handlePinChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6)
    setPin(cleaned)
    if (touched.pin) {
      // Re-validate with the new value directly
      const newErrors: FormErrors = {}
      if (!cleaned) {
        newErrors.pin = "El PIN es obligatorio"
      } else if (cleaned.length < 4) {
        newErrors.pin = "El PIN debe tener entre 4 y 6 digitos"
      }
      setErrors((prev) => ({ ...prev, pin: newErrors.pin }))
    }
  }

  const handleSubmit = async () => {
    setTouched({ name: true, pin: true })
    const allErrors = validate()
    setErrors(allErrors)

    if (Object.keys(allErrors).length > 0) return

    setIsSubmitting(true)
    // Simular creacion
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const isFormValid = name.trim().length >= 3 && pin.length >= 4 && pin.length <= 6 && /^\d+$/.test(pin)

  if (isSuccess) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Check className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-foreground">Grupo creado</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {'"'}{name.trim()}{'"'} se ha creado correctamente.
          </p>
          <Button
            className="mt-8 h-12 w-full max-w-xs text-base font-medium"
            onClick={() => {
              setIsSuccess(false)
              setName("")
              setPin("")
              setTouched({})
              setErrors({})
            }}
          >
            Crear otro grupo
          </Button>
        </div>
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
              onClick={goBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Crear Grupo
            </h1>
          </div>
        </div>
      </header>

      {/* Form content */}
      <div className="flex-1 px-5 pt-6">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          {/* Group name field */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="group-name" className="flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Nombre del grupo
                </Label>
                <Input
                  id="group-name"
                  type="text"
                  placeholder="Ej: Equipo de Desarrollo"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`h-12 text-base ${
                    touched.name && errors.name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  maxLength={40}
                  autoComplete="off"
                />
                <div className="flex items-center justify-between">
                  {touched.name && errors.name ? (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Nombre visible para los miembros del grupo
                    </p>
                  )}
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {name.length}/40
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PIN field */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="group-pin" className="flex items-center gap-2 text-foreground">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  PIN del grupo
                </Label>
                <div className="relative">
                  <Input
                    id="group-pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    placeholder="4 a 6 digitos"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    onBlur={() => handleBlur("pin")}
                    className={`h-12 pr-12 text-base tracking-widest ${
                      touched.pin && errors.pin
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    maxLength={6}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPin(!showPin)}
                    aria-label={showPin ? "Ocultar PIN" : "Mostrar PIN"}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  {touched.pin && errors.pin ? (
                    <p className="text-xs text-destructive">{errors.pin}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Los miembros necesitaran este PIN para unirse
                    </p>
                  )}
                  {pin.length > 0 && (
                    <div className="flex shrink-0 gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full transition-colors ${
                            i < pin.length ? "bg-primary" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit button */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 px-5 pb-8 pt-4"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 60%, transparent)",
        }}
      >
        <div className="mx-auto w-full max-w-lg">
          <Button
            className="h-12 w-full text-base font-medium shadow-lg"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Grupo"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
