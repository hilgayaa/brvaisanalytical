'use client'
import { Suspense } from "react"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your lab equipment admin panel</p>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* <Suspense fallback={<ChartsLoadingSkeleton />}>
        <DashboardCharts />
      </Suspense> */}

      {/* <Suspense fallback={<ActivityLoadingSkeleton />}>
        <RecentActivity />
      </Suspense> */}
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}

function ChartsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  )
}

function ActivityLoadingSkeleton() {
  return <Skeleton className="h-96" />
}
