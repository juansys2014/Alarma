import { BottomNav } from "@/components/bottom-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {children}
      <BottomNav />
    </div>
  )
}
