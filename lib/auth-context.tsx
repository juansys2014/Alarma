"use client"

import { createContext, useContext, type ReactNode } from "react"
import { currentUser, canAccessGroupAdmin, type GlobalRole } from "./mock-data"

interface AuthContextType {
  user: typeof currentUser
  isSystemAdmin: boolean
  canAdminGroup: (groupId: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const isSystemAdmin = currentUser.globalRole === "SYSTEM_ADMIN"

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isSystemAdmin,
        canAdminGroup: canAccessGroupAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
