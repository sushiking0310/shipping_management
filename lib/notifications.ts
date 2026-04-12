import { CloudLightning, Anchor, Tag, Server, LucideIcon } from "lucide-react"

export interface SystemNotification {
  id: number
  title: string
  description: string
  timestamp: string
  type: "destructive" | "warning" | "default"
  icon: LucideIcon
}

export const notifications: SystemNotification[] = [
  {
    id: 1,
    title: "Severe Weather Alert",
    description: "Coastal route to Mumbai delayed by 48h.",
    timestamp: "2026-04-12T13:59:00Z",
    type: "destructive",
    icon: CloudLightning,
  },
  {
    id: 2,
    title: "Port Congestion",
    description: "High wait times reported at JNPT Port.",
    timestamp: "2026-04-12T13:00:00Z",
    type: "warning",
    icon: Anchor,
  },
  {
    id: 3,
    title: "Carrier Promotion",
    description: "Indian Railways offering 5% off bulk freight.",
    timestamp: "2026-04-12T11:00:00Z",
    type: "default",
    icon: Tag,
  },
  {
    id: 4,
    title: "System Update",
    description: "Dynamic pricing module successfully synced.",
    timestamp: "2026-04-11T14:00:00Z",
    type: "default",
    icon: Server,
  },
]
