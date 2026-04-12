"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { MapComponent } from "@/components/dashboard/map-component"
import { shipments, type ShipmentStatus } from "@/lib/mock-data"
import { Search, Ship, Plane, Truck, TrainFront } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const filters: { label: string; value: ShipmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "In Transit", value: "in-transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Delayed", value: "delayed" },
  { label: "At Risk", value: "at-risk" },
  { label: "Pending", value: "pending" },
]

const modeIcons: Record<string, React.ReactNode> = {
  sea: <Ship className="h-3.5 w-3.5" />,
  air: <Plane className="h-3.5 w-3.5" />,
  road: <Truck className="h-3.5 w-3.5" />,
  rail: <TrainFront className="h-3.5 w-3.5" />,
}

export default function TrackingPage() {
  const [activeFilter, setActiveFilter] = useState<ShipmentStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchesFilter = activeFilter === "all" || s.status === activeFilter
      const matchesSearch =
        searchQuery === "" ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.carrier.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchQuery])

  const mapShipments = useMemo(
    () =>
      filtered.map((s) => ({
        id: s.id,
        coords: s.currentCoords,
        status: s.status,
        origin: s.origin,
        destination: s.destination,
        carrier: s.carrier,
        eta: s.eta,
        mode: s.mode,
      })),
    [filtered]
  )

  const selected = selectedShipment ? shipments.find((s) => s.id === selectedShipment) : null

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Intelligent Shipment Tracking" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Map */}
          <Card className="bg-card border-border">
            <CardContent className="p-2">
              <div className="h-[380px]">
                <MapComponent shipments={mapShipments} />
              </div>
            </CardContent>
          </Card>

          {/* Filters + Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, origin, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-64 bg-secondary pl-8 text-xs placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <Button
                  key={f.value}
                  variant={activeFilter === f.value ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveFilter(f.value)}
                  className="h-7 px-3 text-[11px]"
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table + Detail */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="bg-card border-border lg:col-span-2">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mode</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Origin</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Destination</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">ETA</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Delay Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedShipment(s.id)}
                          className={`border-b border-border/50 cursor-pointer transition-colors ${
                            selectedShipment === s.id ? "bg-primary/5" : "hover:bg-secondary/30"
                          }`}
                        >
                          <td className="px-4 py-2.5 font-mono font-medium text-card-foreground">{s.id}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{modeIcons[s.mode]}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{s.origin.split(",")[0]}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{s.destination.split(",")[0]}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                          <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{s.eta}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`font-mono font-medium ${
                              s.delayProbability > 0.5 ? "text-destructive" :
                              s.delayProbability > 0.2 ? "text-warning" : "text-success"
                            }`}>
                              {(s.delayProbability * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Detail Panel */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">
                  {selected ? `Shipment ${selected.id}` : "Select a Shipment"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {selected ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={selected.status} />
                      <span className="text-xs text-muted-foreground">{selected.mode.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <DetailRow label="Origin" value={selected.origin} />
                      <DetailRow label="Destination" value={selected.destination} />
                      <DetailRow label="Carrier" value={selected.carrier} />
                      <DetailRow label="Customer" value={selected.customer} />
                      <DetailRow label="ETA" value={selected.eta} mono />
                      <DetailRow label="Departure" value={selected.departureDate} mono />
                      <DetailRow label="Weight" value={`${selected.weight.toLocaleString()} kg`} mono />
                      <DetailRow label="Value" value={`₹${selected.value.toLocaleString()}`} mono />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground">Transit Progress</span>
                        <span className="text-[10px] font-mono font-medium text-card-foreground">{selected.progress}%</span>
                      </div>
                      <Progress value={selected.progress} className="h-1.5" />
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Risk Assessment</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold font-mono ${
                          selected.riskScore > 50 ? "text-destructive" :
                          selected.riskScore > 25 ? "text-warning" : "text-success"
                        }`}>
                          {selected.riskScore}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-8 text-center">
                    Click on a shipment row to view detailed information.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
      <span className={`text-xs text-card-foreground text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
