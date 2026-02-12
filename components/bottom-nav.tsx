"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { Users, UserCircle, ShieldAlert } from "lucide-react"

const NAV_ITEMS = [
  { path: "/groups", label: "Grupos", icon: Users },
  { path: "/panic", label: "Panico", icon: ShieldAlert, isPanic: true },
  { path: "/contacts", label: "Contactos", icon: UserCircle },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 pb-6 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path)

          if (item.isPanic) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 px-4 py-1.5 text-destructive transition-colors"
                aria-label="Boton de Panico"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive">
                  <ShieldAlert className="h-5 w-5 text-destructive-foreground" />
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span
                className={`text-[10px] ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
