"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, Package, MapPin, Calendar, Scale, DollarSign, Activity } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { shipments, type Shipment } from "@/lib/mock-data"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { notifications } from "@/lib/notifications"
import { RelativeTime } from "@/components/ui/relative-time"

export function DashboardHeader({ title }: { title: string }) {
  const [unreadCount, setUnreadCount] = useState(2)
  const [openSearch, setOpenSearch] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const handleSelectShipment = (shipment: Shipment) => {
    setOpenSearch(false)
    setSelectedShipment(shipment)
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              className="h-8 w-56 bg-secondary pl-8 text-xs placeholder:text-muted-foreground cursor-pointer"
              readOnly
              onClick={() => setOpenSearch(true)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button suppressHydrationWarning variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <span onClick={() => setUnreadCount(0)} className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Mark all as read</span>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${
                        notification.type === 'destructive' ? 'text-destructive' :
                        notification.type === 'warning' ? 'text-amber-500' : ''
                      }`}>
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        <RelativeTime timestamp={notification.timestamp} />
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.description}</span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                <Button asChild variant="ghost" className="w-full justify-center text-xs h-8">
                  <Link href="/notifications">View all notifications</Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">AS</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Command Search Dialog */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search by shipment ID, origin, destination, or carrier..." />
        <CommandList>
          <CommandEmpty>No shipments found.</CommandEmpty>
          <CommandGroup heading="Shipments">
            {shipments.map((s) => (
              <CommandItem
                key={s.id}
                value={`${s.id} ${s.origin} ${s.destination} ${s.carrier}`}
                onSelect={() => handleSelectShipment(s)}
                className="cursor-pointer"
              >
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">{s.id}</span>
                <span className="text-xs text-muted-foreground flex-1">
                  {s.origin} → {s.destination}
                </span>
                <StatusBadge status={s.status} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Shipment Details Dialog */}
      <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
            <DialogDescription className="sr-only">Detailed information for shipment {selectedShipment?.id}</DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="flex flex-col gap-5 mt-2">
              <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg font-mono">{selectedShipment.id}</span>
                </div>
                <StatusBadge status={selectedShipment.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mt-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <MapPin className="h-3.5 w-3.5" /> Origin
                  </span>
                  <span className="font-medium leading-tight">{selectedShipment.origin}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <MapPin className="h-3.5 w-3.5" /> Destination
                  </span>
                  <span className="font-medium leading-tight">{selectedShipment.destination}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Calendar className="h-3.5 w-3.5" /> ETA
                  </span>
                  <span className="font-medium font-mono">{selectedShipment.eta}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Activity className="h-3.5 w-3.5" /> Carrier & Mode
                  </span>
                  <span className="font-medium">{selectedShipment.carrier} <span className="text-muted-foreground font-normal capitalize">({selectedShipment.mode})</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Scale className="h-3.5 w-3.5" /> Weight
                  </span>
                  <span className="font-medium font-mono">{selectedShipment.weight.toLocaleString()} kg</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <DollarSign className="h-3.5 w-3.5" /> Value
                  </span>
                  <span className="font-medium font-mono text-emerald-600 dark:text-emerald-400">₹{selectedShipment.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
