"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shipments..."
            className="h-8 w-56 bg-secondary pl-8 text-xs placeholder:text-muted-foreground"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button suppressHydrationWarning variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                2
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-sm font-semibold">Notifications</h2>
              <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Mark all as read</span>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium text-destructive">Severe Weather Alert</span>
                  <span className="text-[10px] text-muted-foreground">10m ago</span>
                </div>
                <span className="text-xs text-muted-foreground">Coastal route to Mumbai delayed by 48h.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium text-amber-500">Port Congestion</span>
                  <span className="text-[10px] text-muted-foreground">1h ago</span>
                </div>
                <span className="text-xs text-muted-foreground">High wait times reported at JNPT Port.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium">Carrier Promotion</span>
                  <span className="text-[10px] text-muted-foreground">3h ago</span>
                </div>
                <span className="text-xs text-muted-foreground">Indian Railways offering 5% off bulk freight.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium">System Update</span>
                  <span className="text-[10px] text-muted-foreground">1d ago</span>
                </div>
                <span className="text-xs text-muted-foreground">Dynamic pricing module successfully synced.</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-1">
              <Button variant="ghost" className="w-full justify-center text-xs h-8">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">AS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
