"use client"

import { cn } from "@/lib/utils"

type StatusType = "in-transit" | "delivered" | "delayed" | "at-risk" | "pending" |
  "generated" | "validated" | "error" |
  "applied" | "pending-review" | "overridden" |
  "active" | "resolved" | "investigating" | "false-positive" |
  "critical" | "high" | "medium" | "low"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  "in-transit": { label: "In Transit", className: "bg-primary/15 text-primary border-primary/30" },
  "delivered": { label: "Delivered", className: "bg-success/15 text-success border-success/30" },
  "delayed": { label: "Delayed", className: "bg-warning/15 text-warning border-warning/30" },
  "at-risk": { label: "At Risk", className: "bg-destructive/15 text-destructive border-destructive/30" },
  "pending": { label: "Pending", className: "bg-muted text-muted-foreground border-border" },
  "generated": { label: "Generated", className: "bg-primary/15 text-primary border-primary/30" },
  "validated": { label: "Validated", className: "bg-success/15 text-success border-success/30" },
  "error": { label: "Error", className: "bg-destructive/15 text-destructive border-destructive/30" },
  "applied": { label: "Applied", className: "bg-success/15 text-success border-success/30" },
  "pending-review": { label: "Pending Review", className: "bg-warning/15 text-warning border-warning/30" },
  "overridden": { label: "Overridden", className: "bg-muted text-muted-foreground border-border" },
  "active": { label: "Active", className: "bg-destructive/15 text-destructive border-destructive/30" },
  "resolved": { label: "Resolved", className: "bg-success/15 text-success border-success/30" },
  "investigating": { label: "Investigating", className: "bg-warning/15 text-warning border-warning/30" },
  "false-positive": { label: "False Positive", className: "bg-muted text-muted-foreground border-border" },
  "critical": { label: "Critical", className: "bg-destructive/15 text-destructive border-destructive/30" },
  "high": { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  "medium": { label: "Medium", className: "bg-warning/15 text-warning border-warning/30" },
  "low": { label: "Low", className: "bg-muted text-muted-foreground border-border" },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" }
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", config.className, className)}>
      {config.label}
    </span>
  )
}
