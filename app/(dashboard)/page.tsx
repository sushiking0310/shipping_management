"use client"

import { useMemo } from "react"
import {
  Ship,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Package,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { MapComponent } from "@/components/dashboard/map-component"
import {
  shipments,
  kpiData,
} from "@/lib/mock-data"
import { generateShipmentVolumeData } from "@/lib/generateShipmentVolumeData"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function formatCurrency(value: number) {
  if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export default function DashboardOverview() {
  const volumeData = useMemo(() => generateShipmentVolumeData(), [])
  const mapShipments = useMemo(
    () =>
      shipments
        .filter((s) => s.status !== "delivered")
        .map((s) => ({
          id: s.id,
          coords: s.currentCoords,
          status: s.status,
          origin: s.origin,
          destination: s.destination,
          carrier: s.carrier,
          eta: s.eta,
          mode: s.mode,
        })),
    []
  )

  const recentShipments = shipments.slice(0, 6)

  const modeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    shipments.forEach((s) => {
      counts[s.mode] = (counts[s.mode] || 0) + 1
    })
    return Object.entries(counts).map(([mode, count]) => ({
      mode: mode.charAt(0).toUpperCase() + mode.slice(1),
      count,
    }))
  }, [])

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Dashboard Overview" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KPICard
              title="Active Shipments"
              value={kpiData.activeShipments.value.toString()}
              change={kpiData.activeShipments.change}
              trend={kpiData.activeShipments.trend}
              icon={<Ship className="h-4 w-4" />}
            />
            <KPICard
              title="On-Time Rate"
              value={`${kpiData.onTimeRate.value}%`}
              change={kpiData.onTimeRate.change}
              trend={kpiData.onTimeRate.trend}
              icon={<Clock className="h-4 w-4" />}
            />
            <KPICard
              title="Total Revenue"
              value={formatCurrency(kpiData.totalRevenue.value)}
              change={kpiData.totalRevenue.change}
              trend={kpiData.totalRevenue.trend}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <KPICard
              title="Risk Alerts"
              value={kpiData.riskAlerts.value.toString()}
              change={Math.abs(kpiData.riskAlerts.change) * 10}
              trend={kpiData.riskAlerts.trend}
              icon={<AlertTriangle className="h-4 w-4" />}
              positiveIsGood={false}
            />
          </div>

          {/* Map + Chart Row */}
          <div className="grid gap-3 lg:grid-cols-5">
            <Card className="bg-card border-border lg:col-span-3">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Live Shipment Map</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[340px]">
                  <MapComponent shipments={mapShipments} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Shipment Volume (30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillShipments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.65 0.2 260)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(0.65 0.2 260)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.7 0.18 155)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(0.7 0.18 155)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }}
                        tickFormatter={(v) => v.slice(5)}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.17 0.015 260)",
                          border: "1px solid oklch(0.25 0.01 260)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "oklch(0.95 0.01 260)",
                        }}
                      />
                      <Area type="monotone" dataKey="shipments" stroke="oklch(0.65 0.2 260)" fill="url(#fillShipments)" strokeWidth={2} />
                      <Area type="monotone" dataKey="delivered" stroke="oklch(0.7 0.18 155)" fill="url(#fillDelivered)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Shipments Table + Mode Breakdown */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-card-foreground">Recent Shipments</CardTitle>
                  <span className="text-[10px] text-muted-foreground font-medium">{shipments.length} total</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Route</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Carrier</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentShipments.map((s) => (
                        <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-2.5 font-mono font-medium text-card-foreground">{s.id}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {s.origin.split(",")[0]} → {s.destination.split(",")[0]}
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={s.status} />
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{s.carrier}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{s.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Transport Mode Mix</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modeBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis
                        dataKey="mode"
                        tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.17 0.015 260)",
                          border: "1px solid oklch(0.25 0.01 260)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "oklch(0.95 0.01 260)",
                        }}
                      />
                      <Bar dataKey="count" fill="oklch(0.65 0.2 260)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 px-2">
                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <Package className="h-3.5 w-3.5 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Avg. Value</p>
                      <p className="text-xs font-bold font-mono text-card-foreground">₹248K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Throughput</p>
                      <p className="text-xs font-bold font-mono text-card-foreground">+12.5%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
