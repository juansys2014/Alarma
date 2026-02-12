"use client"

import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "./app-layout"
import { LoginForm } from "./login-form"
import { GroupsList } from "./groups-list"
import { CreateGroupForm } from "./create-group-form"
import { GroupDetail } from "./group-detail"
import { InviteMemberForm } from "./invite-member-form"
import { ContactsScreen } from "./contacts-screen"
import { PanicButtonScreen } from "./panic-button-screen"
import { AlertDetailScreen } from "./alert-detail-screen"

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Login - sin bottom nav */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rutas con bottom nav */}
        <Route element={<AppLayout />}>
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/groups/new" element={<CreateGroupForm />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/:groupId/invite" element={<InviteMemberForm />} />
          <Route path="/contacts" element={<ContactsScreen />} />
          <Route path="/panic" element={<PanicButtonScreen />} />
          <Route path="/events/:eventId" element={<AlertDetailScreen />} />
        </Route>

        {/* Redirect raiz a groups (mock sesion activa) */}
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </HashRouter>
  )
}
