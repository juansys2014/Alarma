// Mock current user - change role to "USER" to test non-admin view
export type GlobalRole = "SYSTEM_ADMIN" | "USER"
export type GroupRole = "GROUP_ADMIN" | "MEMBER"

export interface CurrentUser {
  id: string
  name: string
  email: string
  initials: string
  globalRole: GlobalRole
}

export const currentUser: CurrentUser = {
  id: "u-admin",
  name: "Admin Principal",
  email: "admin@alarma.app",
  initials: "AP",
  globalRole: "SYSTEM_ADMIN",
}

// -- Users --

export interface AppUser {
  id: string
  name: string
  email: string
  initials: string
  globalRole: GlobalRole
  status: "activo" | "pendiente"
  createdAt: string
}

export const mockUsers: AppUser[] = [
  { id: "u-admin", name: "Admin Principal", email: "admin@alarma.app", initials: "AP", globalRole: "SYSTEM_ADMIN", status: "activo", createdAt: "10 Ene 2025" },
  { id: "u1", name: "Carlos Garcia", email: "carlos@email.com", initials: "CG", globalRole: "USER", status: "activo", createdAt: "15 Ene 2025" },
  { id: "u2", name: "Maria Lopez", email: "maria@email.com", initials: "ML", globalRole: "USER", status: "activo", createdAt: "20 Ene 2025" },
  { id: "u3", name: "Juan Martinez", email: "juan@email.com", initials: "JM", globalRole: "USER", status: "activo", createdAt: "22 Ene 2025" },
  { id: "u4", name: "Ana Torres", email: "ana@email.com", initials: "AT", globalRole: "USER", status: "pendiente", createdAt: "5 Feb 2025" },
  { id: "u5", name: "Pedro Ruiz", email: "pedro@email.com", initials: "PR", globalRole: "USER", status: "activo", createdAt: "8 Feb 2025" },
  { id: "u6", name: "Sofia Herrera", email: "sofia@email.com", initials: "SH", globalRole: "USER", status: "pendiente", createdAt: "10 Feb 2025" },
  { id: "u7", name: "Diego Morales", email: "diego@email.com", initials: "DM", globalRole: "USER", status: "activo", createdAt: "12 Feb 2025" },
]

// -- Groups --

export interface AppGroup {
  id: string
  name: string
  initials: string
  color: string
  owner: string
  ownerId: string
  memberCount: number
  createdAt: string
}

export const mockGroups: AppGroup[] = [
  { id: "1", name: "Equipo de Desarrollo", initials: "ED", color: "bg-primary text-primary-foreground", owner: "Carlos Garcia", ownerId: "u1", memberCount: 12, createdAt: "15 Ene 2025" },
  { id: "2", name: "Marketing Digital", initials: "MD", color: "bg-foreground/80 text-background", owner: "Maria Lopez", ownerId: "u2", memberCount: 8, createdAt: "18 Ene 2025" },
  { id: "3", name: "Soporte Tecnico", initials: "ST", color: "bg-muted-foreground text-background", owner: "Juan Martinez", ownerId: "u3", memberCount: 5, createdAt: "20 Ene 2025" },
  { id: "4", name: "Recursos Humanos", initials: "RH", color: "bg-primary/70 text-primary-foreground", owner: "Ana Torres", ownerId: "u4", memberCount: 15, createdAt: "25 Ene 2025" },
  { id: "5", name: "Ventas y Negocios", initials: "VN", color: "bg-foreground/60 text-background", owner: "Pedro Ruiz", ownerId: "u5", memberCount: 22, createdAt: "1 Feb 2025" },
]

// -- Group membership (who is GROUP_ADMIN per group) --

export interface GroupMember {
  userId: string
  userName: string
  userEmail: string
  userInitials: string
  groupRole: GroupRole
  receivesAlerts: boolean
}

export const mockGroupMembers: Record<string, GroupMember[]> = {
  "1": [
    { userId: "u1", userName: "Carlos Garcia", userEmail: "carlos@email.com", userInitials: "CG", groupRole: "GROUP_ADMIN", receivesAlerts: true },
    { userId: "u2", userName: "Maria Lopez", userEmail: "maria@email.com", userInitials: "ML", groupRole: "GROUP_ADMIN", receivesAlerts: true },
    { userId: "u3", userName: "Juan Martinez", userEmail: "juan@email.com", userInitials: "JM", groupRole: "MEMBER", receivesAlerts: true },
    { userId: "u4", userName: "Ana Torres", userEmail: "ana@email.com", userInitials: "AT", groupRole: "MEMBER", receivesAlerts: false },
    { userId: "u5", userName: "Pedro Ruiz", userEmail: "pedro@email.com", userInitials: "PR", groupRole: "MEMBER", receivesAlerts: true },
  ],
  "2": [
    { userId: "u2", userName: "Maria Lopez", userEmail: "maria@email.com", userInitials: "ML", groupRole: "GROUP_ADMIN", receivesAlerts: true },
    { userId: "u6", userName: "Sofia Herrera", userEmail: "sofia@email.com", userInitials: "SH", groupRole: "MEMBER", receivesAlerts: true },
    { userId: "u7", userName: "Diego Morales", userEmail: "diego@email.com", userInitials: "DM", groupRole: "MEMBER", receivesAlerts: false },
  ],
}

// -- Group events/alerts mock --

export interface GroupEvent {
  id: string
  type: "alerta" | "cancelada" | "prueba"
  triggeredBy: string
  timestamp: string
  status: "activa" | "cancelada" | "resuelta"
}

export const mockGroupEvents: Record<string, GroupEvent[]> = {
  "1": [
    { id: "ALR-0042", type: "alerta", triggeredBy: "Carlos Garcia", timestamp: "Hoy, 14:32", status: "activa" },
    { id: "ALR-0041", type: "alerta", triggeredBy: "Juan Martinez", timestamp: "Ayer, 09:15", status: "resuelta" },
    { id: "ALR-0040", type: "prueba", triggeredBy: "Maria Lopez", timestamp: "10 Feb, 16:00", status: "resuelta" },
    { id: "ALR-0039", type: "alerta", triggeredBy: "Ana Torres", timestamp: "8 Feb, 22:10", status: "cancelada" },
  ],
  "2": [
    { id: "ALR-0038", type: "alerta", triggeredBy: "Sofia Herrera", timestamp: "Hoy, 11:05", status: "activa" },
    { id: "ALR-0037", type: "prueba", triggeredBy: "Maria Lopez", timestamp: "Ayer, 15:30", status: "resuelta" },
  ],
}

// Utility: check if current user can access group admin
export function canAccessGroupAdmin(groupId: string): boolean {
  if (currentUser.globalRole === "SYSTEM_ADMIN") return true
  const members = mockGroupMembers[groupId] || []
  const membership = members.find((m) => m.userId === currentUser.id)
  return membership?.groupRole === "GROUP_ADMIN"
}
