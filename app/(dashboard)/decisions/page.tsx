"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { decisions } from "@/lib/mock-data"
import { Brain, CheckCircle2, Clock, XCircle, DollarSign, Zap } from "lucide-react"
import {
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts"

export default function DecisionsPage() {
  const stats = useMemo(() => {
    const applied = decisions.filter((d) => d.status === "applied").length
    const pending = decisions.filter((d) => d.status === "pending-review").length
    const overridden = decisions.filter((d) => d.status === "overridden").length
    const totalSavings = decisions.reduce((a, d) => a + d.savings, 0)
    return { applied, pending, overridden, totalSavings }
  }, [])

  const savingsData = decisions.map((d) => ({
    name: d.id.replace("DEC-", "D"),
    savings: d.savings,
    type: d.type,
  }))

  const criteriaData = [
    { criteria: "Cost", weight: 85 },
    { criteria: "Speed", weight: 78 },
    { criteria: "Risk", weight: 92 },
    { criteria: "Reliability", weight: 88 },
    { criteria: "Capacity", weight: 65 },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Autonomous Shipping Decision Engine" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Applied</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.applied}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending Review</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.pending}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Overridden</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.overridden}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Savings</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">
                    ₹{stats.totalSavings > 0 ? "+" : ""}{stats.totalSavings.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Cost Savings by Decision</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, "Savings"]}
                      />
                      <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                        {savingsData.map((entry, index) => (
                          <Cell key={index} fill={entry.savings >= 0 ? "oklch(0.7 0.18 155)" : "oklch(0.65 0.2 25)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Decision Criteria Weights</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={criteriaData}>
                      <PolarGrid stroke="oklch(0.25 0.01 260)" />
                      <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} />
                      <PolarRadiusAxis tick={{ fontSize: 9, fill: "oklch(0.4 0.01 260)" }} domain={[0, 100]} />
                      <Radar name="Weight" dataKey="weight" stroke="oklch(0.65 0.2 260)" fill="oklch(0.65 0.2 260)" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Feed */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-card-foreground">Decision Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Shipment</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Carrier</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mode</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decisions.map((d) => (
                      <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors group">
                        <td className="px-4 py-2.5 font-mono font-medium text-card-foreground">{d.id}</td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{d.shipmentId}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-primary" />
                            {d.type}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.carrier}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.mode}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`font-mono font-medium ${d.savings >= 0 ? "text-success" : "text-destructive"}`}>
                            {d.savings >= 0 ? "+" : ""}₹{Math.abs(d.savings).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Decision Details (reasoning) */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {decisions.slice(0, 3).map((d) => (
              <Card key={d.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-card-foreground">{d.id}</span>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{d.type} for {d.shipmentId}</p>
                  <div className="rounded-md bg-secondary/50 p-2.5 mt-2">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">AI Reasoning</p>
                    <p className="text-xs text-card-foreground leading-relaxed">{d.reasoning}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(d.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-mono font-medium ${d.savings >= 0 ? "text-success" : "text-destructive"}`}>
                      {d.savings >= 0 ? "+" : ""}₹{Math.abs(d.savings).toLocaleString()}
                    </span>
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
