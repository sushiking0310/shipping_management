"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MapPin,
  Route,
  FileText,
  ShieldAlert,
  Brain,
  DollarSign,
  Fingerprint,
  Warehouse,
  Ship,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Shipment Tracking", href: "/tracking", icon: MapPin },
  { title: "Route Optimization", href: "/routes", icon: Route },
  { title: "Documentation", href: "/documents", icon: FileText },
  { title: "Risk Prediction", href: "/risk", icon: ShieldAlert },
  { title: "Decision Engine", href: "/decisions", icon: Brain },
  { title: "Dynamic Pricing", href: "/pricing", icon: DollarSign },
  { title: "Fraud Detection", href: "/fraud", icon: Fingerprint },
  { title: "Inventory", href: "/inventory", icon: Warehouse },
]

import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-3">
        <Link href="/" className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Ship className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">ShipSmart</span>
            <span className="text-[10px] text-muted-foreground">Management Platform</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(isActive && "bg-sidebar-accent text-sidebar-primary")}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3 mb-2 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] font-medium text-muted-foreground">Platform Status</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-sidebar-foreground">All Systems Operational</span>
          </div>
        </div>
        {session?.user && (
          <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="h-8 w-8 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium truncate">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{session.user.email}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 hover:bg-sidebar-accent rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
