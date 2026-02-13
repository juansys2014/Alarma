import { currentUser, canAccessGroupAdmin } from "@/lib/mock-data"

export function canAccessSystemAdmin(): boolean {
  return currentUser.globalRole === "SYSTEM_ADMIN"
}

export function canAccessGroupAdminRoute(groupId: string): boolean {
  return canAccessGroupAdmin(groupId)
}
