"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { fraudAlerts } from "@/lib/mock-data"
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Bar,
  BarChart,
} from "recharts"

export default function FraudPage() {
  const [filter, setFilter] = useState<string>("all")
  const [detailAlert, setDetailAlert] = useState<typeof fraudAlerts[0] | null>(null)

  const filtered = useMemo(() => {
    if (filter === "all") return fraudAlerts
    return fraudAlerts.filter((a) => a.status === filter)
  }, [filter])

  const stats = useMemo(() => {
    const active = fraudAlerts.filter((a) => a.status === "active" || a.status === "investigating").length
    const resolved = fraudAlerts.filter((a) => a.status === "resolved").length
    const falsePos = fraudAlerts.filter((a) => a.status === "false-positive").length
    const fpRate = ((falsePos / fraudAlerts.length) * 100).toFixed(1)
    return { active, resolved, falsePos, fpRate }
  }, [])

  const scatterData = fraudAlerts.map((a, i) => ({
    x: a.confidence,
    y: a.severity === "critical" ? 4 : a.severity === "high" ? 3 : a.severity === "medium" ? 2 : 1,
    id: a.id,
    status: a.status,
  }))

  const typeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    fraudAlerts.forEach((a) => {
      counts[a.type] = (counts[a.type] || 0) + 1
    })
    return Object.entries(counts).map(([type, count]) => ({ type: type.replace(" ", "\n"), count }))
  }, [])

  const severityColors: Record<string, string> = {
    active: "oklch(0.65 0.2 25)",
    investigating: "oklch(0.75 0.15 75)",
    resolved: "oklch(0.7 0.18 155)",
    "false-positive": "oklch(0.5 0.01 260)",
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="AI-Based Fraud & Tampering Detection" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Flags</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.active}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <ShieldCheck className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Resolved</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.resolved}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <ShieldX className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">False Positives</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.falsePos}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">FP Rate</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.fpRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Anomaly Confidence vs Severity</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis dataKey="x" name="Confidence" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} label={{ value: "Confidence %", position: "bottom", fontSize: 10, fill: "oklch(0.5 0.01 260)", offset: -5 }} />
                      <YAxis dataKey="y" name="Severity" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} domain={[0, 5]}
                        tickFormatter={(v) => v === 4 ? "Critical" : v === 3 ? "High" : v === 2 ? "Medium" : v === 1 ? "Low" : ""} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }}
                        formatter={(value: number, name: string) => [name === "Confidence" ? `${value}%` : ["", "Low", "Medium", "High", "Critical"][value], name]}
                      />
                      <Scatter data={scatterData}>
                        {scatterData.map((entry, i) => (
                          <Cell key={i} fill={severityColors[entry.status] || "oklch(0.5 0.01 260)"} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Detection Types</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeBreakdown} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="type" type="category" tick={{ fontSize: 9, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} width={110} />
                      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                      <Bar dataKey="count" fill="oklch(0.65 0.2 260)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5">
            {["all", "active", "investigating", "resolved", "false-positive"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                size="sm"
                onClick={() => setFilter(f)}
                className="h-7 px-3 text-[11px] capitalize"
              >
                {f === "all" ? "All Alerts" : f.replace("-", " ")}
              </Button>
            ))}
          </div>

          {/* Alerts table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Shipment</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Severity</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Confidence</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-medium text-card-foreground">{a.id}</td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{a.shipmentId}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={a.severity} /></td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.type}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`font-mono font-medium ${a.confidence > 80 ? "text-destructive" : a.confidence > 60 ? "text-warning" : "text-muted-foreground"}`}>
                            {a.confidence}%
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setDetailAlert(a)}>
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">View alert details</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailAlert} onOpenChange={() => setDetailAlert(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Alert {detailAlert?.id}</DialogTitle>
            <DialogDescription>
              Fraud alert for shipment {detailAlert?.shipmentId}
            </DialogDescription>
          </DialogHeader>
          {detailAlert && (
            <div className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-[10px] text-muted-foreground">Severity</p>
                  <div className="mt-1"><StatusBadge status={detailAlert.severity} /></div>
                </div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-[10px] text-muted-foreground">Confidence</p>
                  <p className="mt-1 font-mono font-medium text-card-foreground">{detailAlert.confidence}%</p>
                </div>
              </div>
              <div className="rounded-md bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Type</p>
                <p className="text-xs text-card-foreground">{detailAlert.type}</p>
              </div>
              <div className="rounded-md bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Evidence</p>
                <p className="text-xs text-card-foreground leading-relaxed">{detailAlert.description}</p>
              </div>
              <div className="rounded-md bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Recommended Action</p>
                <p className="text-xs text-card-foreground leading-relaxed">
                  {detailAlert.severity === "critical"
                    ? "Immediately halt shipment for physical inspection. Notify customs and insurance."
                    : detailAlert.severity === "high"
                    ? "Flag for priority investigation. Cross-reference documentation with origin records."
                    : "Monitor closely. Review documentation for discrepancies during next checkpoint."}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Detected: {new Date(detailAlert.timestamp).toLocaleString()}</span>
                <StatusBadge status={detailAlert.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
