"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { notifications } from "@/lib/notifications"
import { RelativeTime } from "@/components/ui/relative-time"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Notifications" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">All Notifications</h1>
              <p className="text-sm text-muted-foreground mt-1">Stay updated with your latest alerts and system information.</p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              Mark all as read
            </button>
          </div>
          
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="border-border bg-card hover:bg-secondary/20 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer">
                  <div className={`mt-0.5 p-2.5 rounded-full shrink-0 ${
                    notification.type === 'destructive' ? 'bg-destructive/10 text-destructive' :
                    notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${
                         notification.type === 'destructive' ? 'text-destructive' :
                         notification.type === 'warning' ? 'text-amber-500' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        <RelativeTime timestamp={notification.timestamp} />
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
