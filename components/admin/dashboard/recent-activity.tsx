import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: number
  type: "product" | "inquiry" | "category"
  action: string
  description: string
  timestamp: string
}

async function getRecentActivity() {
  const response = await fetch(`/api/admin/dashboard/recent-activity`, {
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
    },
    cache: "no-store",

  })

  if (!response.ok) {
    throw new Error("Failed to fetch recent activity")
  }
  return response.json()
}

export async function RecentActivity() {
  const activities: Activity[] = await getRecentActivity()

  const getActivityColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "inquiry":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "category":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <Badge variant="secondary" className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
