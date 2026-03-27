"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
  positiveIsGood?: boolean
}

export function KPICard({ title, value, change, trend, icon, positiveIsGood = true }: KPICardProps) {
  const isPositive = trend === "up"
  const isGood = positiveIsGood ? isPositive : !isPositive

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
            <span className="text-2xl font-bold font-mono text-card-foreground">{value}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUpRight className={cn("h-3.5 w-3.5", isGood ? "text-success" : "text-destructive")} />
          ) : (
            <ArrowDownRight className={cn("h-3.5 w-3.5", isGood ? "text-success" : "text-destructive")} />
          )}
          <span className={cn("text-xs font-medium font-mono", isGood ? "text-success" : "text-destructive")}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
