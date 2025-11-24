import { AdminSidebar } from "@/components/admin-sidbar"
import type React from "react"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="container mx-auto p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
