"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, UserCircle, ShieldAlert, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function BottomNav() {
  const pathname = usePathname()
  const { isSystemAdmin } = useAuth()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 pb-6 pt-2">
        {/* Grupos */}
        <NavItem href="/grupos" label="Grupos" icon={Users} active={pathname.startsWith("/grupos")} />

        {/* Panico */}
        <Link
          href="/panico"
          className="flex flex-col items-center gap-1 px-3 py-1.5 text-destructive transition-colors"
          aria-label="Boton de Panico"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive">
            <ShieldAlert className="h-5 w-5 text-destructive-foreground" />
          </div>
          <span className="text-[10px] font-semibold">Panico</span>
        </Link>

        {/* Contactos */}
        <NavItem href="/contactos" label="Contactos" icon={UserCircle} active={pathname.startsWith("/contactos")} />

        {/* Admin - solo SYSTEM_ADMIN */}
        {isSystemAdmin && (
          <NavItem href="/admin" label="Admin" icon={Shield} active={pathname.startsWith("/admin")} />
        )}
      </div>
    </nav>
  )
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
      <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
        {label}
      </span>
    </Link>
  )
}
