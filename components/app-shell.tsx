"use client"

import { useState, useCallback, createContext, useContext } from "react"

// -- Navigation context --

type Screen =
  | "login"
  | "groups"
  | "create-group"
  | "group-detail"
  | "invite-member"
  | "contacts"
  | "panic-button"
  | "alert-detail"

interface NavigationContextType {
  navigate: (screen: Screen) => void
  goBack: () => void
}

const NavigationContext = createContext<NavigationContextType>({
  navigate: () => {},
  goBack: () => {},
})

export function useNavigation() {
  return useContext(NavigationContext)
}

// -- Lazy imports --
import { LoginForm } from "./login-form"
import { GroupsList } from "./groups-list"
import { CreateGroupForm } from "./create-group-form"
import { GroupDetail } from "./group-detail"
import { InviteMemberForm } from "./invite-member-form"
import { ContactsScreen } from "./contacts-screen"
import { PanicButtonScreen } from "./panic-button-screen"
import { AlertDetailScreen } from "./alert-detail-screen"

export function AppShell() {
  const [screen, setScreen] = useState<Screen>("login")
  const [history, setHistory] = useState<Screen[]>([])

  const navigate = useCallback((target: Screen) => {
    setHistory((prev) => [...prev, screen])
    setScreen(target)
  }, [screen])

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev
      const newHistory = [...prev]
      const previousScreen = newHistory.pop()!
      setScreen(previousScreen)
      return newHistory
    })
  }, [])

  return (
    <NavigationContext.Provider value={{ navigate, goBack }}>
      {screen === "login" && <LoginForm />}
      {screen === "groups" && <GroupsList />}
      {screen === "create-group" && <CreateGroupForm />}
      {screen === "group-detail" && <GroupDetail />}
      {screen === "invite-member" && <InviteMemberForm />}
      {screen === "contacts" && <ContactsScreen />}
      {screen === "panic-button" && <PanicButtonScreen />}
      {screen === "alert-detail" && <AlertDetailScreen />}
    </NavigationContext.Provider>
  )
}
