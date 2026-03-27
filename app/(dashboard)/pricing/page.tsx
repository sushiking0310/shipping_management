"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { pricingLanes, generatePricingHistoryData } from "@/lib/mock-data"
import { DollarSign, TrendingUp, Gauge, BarChart3 } from "lucide-react"
import {
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function PricingPage() {
  const [selectedLane, setSelectedLane] = useState<string | null>(null)
  const pricingHistory = useMemo(() => generatePricingHistoryData(), [])

  const stats = useMemo(() => {
    const avgRate = pricingLanes.reduce((a, l) => a + l.currentRate, 0) / pricingLanes.length
    const avgMultiplier = pricingLanes.reduce((a, l) => a + l.multiplier, 0) / pricingLanes.length
    const avgUtil = pricingLanes.reduce((a, l) => a + l.capacityUtilization, 0) / pricingLanes.length
    const highDemand = pricingLanes.filter((l) => l.demand === "high").length
    return { avgRate, avgMultiplier, avgUtil, highDemand }
  }, [])

  const demandDistribution = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 }
    pricingLanes.forEach((l) => counts[l.demand]++)
    return [
      { name: "High", value: counts.high, color: "oklch(0.65 0.2 25)" },
      { name: "Medium", value: counts.medium, color: "oklch(0.75 0.15 75)" },
      { name: "Low", value: counts.low, color: "oklch(0.7 0.18 155)" },
    ]
  }, [])

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Dynamic Pricing Engine" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Rate/kg</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">₹{stats.avgRate.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <TrendingUp className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Multiplier</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.avgMultiplier.toFixed(2)}x</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-5/10">
                  <Gauge className="h-4 w-4 text-chart-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Capacity Util.</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.avgUtil.toFixed(0)}%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <BarChart3 className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">High Demand Lanes</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.highDemand}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price history chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-card-foreground">Price & Factor Trends (30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pricingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                    <Line type="monotone" dataKey="avgRate" stroke="oklch(0.65 0.2 260)" strokeWidth={2} dot={false} name="Avg Rate (₹/kg)" />
                    <Line type="monotone" dataKey="fuelIndex" stroke="oklch(0.75 0.15 75)" strokeWidth={2} dot={false} name="Fuel Index" />
                    <Line type="monotone" dataKey="demandIndex" stroke="oklch(0.65 0.2 25)" strokeWidth={2} dot={false} name="Demand Index" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lane Table + Pie */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Lane Pricing</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Lane</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Base Rate</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Current Rate</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Multiplier</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Demand</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Capacity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingLanes.map((l) => (
                        <tr
                          key={l.id}
                          className={`border-b border-border/50 cursor-pointer transition-colors ${selectedLane === l.id ? "bg-primary/5" : "hover:bg-secondary/30"}`}
                          onClick={() => setSelectedLane(l.id)}
                        >
                          <td className="px-4 py-2.5 text-card-foreground">
                            {l.origin} → {l.destination}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">₹{l.baseRate.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-card-foreground">₹{l.currentRate.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`font-mono font-medium ${l.multiplier > 1.2 ? "text-destructive" : l.multiplier > 1.1 ? "text-warning" : "text-success"}`}>
                              {l.multiplier.toFixed(2)}x
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={l.demand as "high" | "medium" | "low"} />
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-secondary">
                                <div
                                  className={`h-full rounded-full ${l.capacityUtilization > 90 ? "bg-destructive" : l.capacityUtilization > 70 ? "bg-warning" : "bg-success"}`}
                                  style={{ width: `${l.capacityUtilization}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground w-8">{l.capacityUtilization}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Demand Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex flex-col items-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demandDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        stroke="oklch(0.17 0.015 260)"
                        strokeWidth={3}
                      >
                        {demandDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  {demandDistribution.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] text-muted-foreground">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
