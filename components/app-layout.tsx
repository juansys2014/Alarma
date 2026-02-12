"use client"

import { Outlet } from "react-router-dom"
import { BottomNav } from "./bottom-nav"

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Outlet />
      <BottomNav />
    </div>
  )
}
