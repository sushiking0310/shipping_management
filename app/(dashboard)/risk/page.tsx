"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { shipmentRisks, shipments } from "@/lib/mock-data"
import { generateRiskTrendData } from "@/lib/generateRiskTrendData"
import { ShieldAlert, ShieldCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"

export default function RiskPage() {
  const [selectedRisk, setSelectedRisk] = useState(shipmentRisks[0].shipmentId)
  const trendData = useMemo(() => generateRiskTrendData(), [])

  const stats = useMemo(() => {
    const avg = shipmentRisks.reduce((a, r) => a + r.overallScore, 0) / shipmentRisks.length
    const highRisk = shipmentRisks.filter((r) => r.overallScore > 50).length
    const mitigated = shipmentRisks.filter((r) => r.trend === "decreasing").length
    return { avg, highRisk, mitigated }
  }, [])

  const selected = shipmentRisks.find((r) => r.shipmentId === selectedRisk)
  const selectedShipment = shipments.find((s) => s.id === selectedRisk)

  const radarData = selected
    ? [
        { factor: "Delay", value: selected.factors.delay },
        { factor: "Damage", value: selected.factors.damage },
        { factor: "Theft", value: selected.factors.theft },
        { factor: "Compliance", value: selected.factors.compliance },
        { factor: "Weather", value: selected.factors.weather },
      ]
    : []

  return (
    <div className="flex flex-col">
      <DashboardHeader title="AI-Based Shipment Risk Prediction" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Risk Score</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.avg.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">High Risk</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.highRisk}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <ShieldCheck className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mitigated</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.mitigated}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Trend Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-card-foreground">Risk Trend (30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.75 0.15 75)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.75 0.15 75)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                    <Area type="monotone" dataKey="avgRisk" stroke="oklch(0.75 0.15 75)" fill="url(#fillRisk)" strokeWidth={2} name="Avg Risk" />
                    <Line type="monotone" dataKey="highRiskCount" stroke="oklch(0.65 0.2 25)" strokeWidth={2} dot={false} name="High Risk Count" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table + Radar + Mitigation */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="bg-card border-border lg:col-span-1">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Risk Scores by Shipment</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[320px] overflow-y-auto">
                  {shipmentRisks.map((r) => (
                    <button
                      key={r.shipmentId}
                      onClick={() => setSelectedRisk(r.shipmentId)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 border-b border-border/50 text-left transition-colors ${
                        selectedRisk === r.shipmentId ? "bg-primary/5" : "hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-medium text-card-foreground">{r.shipmentId}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {r.trend === "increasing" && <ArrowUpRight className="h-2.5 w-2.5 text-destructive" />}
                          {r.trend === "decreasing" && <ArrowDownRight className="h-2.5 w-2.5 text-success" />}
                          {r.trend}
                        </span>
                      </div>
                      <span className={`text-lg font-bold font-mono ${
                        r.overallScore > 60 ? "text-destructive" : r.overallScore > 30 ? "text-warning" : "text-success"
                      }`}>
                        {r.overallScore}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Risk Factor Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.25 0.01 260)" />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} />
                      <PolarRadiusAxis tick={{ fontSize: 9, fill: "oklch(0.4 0.01 260)" }} domain={[0, 100]} />
                      <Radar
                        name="Risk"
                        dataKey="value"
                        stroke="oklch(0.65 0.2 25)"
                        fill="oklch(0.65 0.2 25)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 260)", border: "1px solid oklch(0.25 0.01 260)", borderRadius: "8px", fontSize: "11px", color: "oklch(0.95 0.01 260)" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Mitigation Plan</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {selected && selectedShipment ? (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Shipment</p>
                      <p className="text-sm font-semibold text-card-foreground">{selected.shipmentId}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {selectedShipment.origin} → {selectedShipment.destination}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Overall Risk Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold font-mono ${
                          selected.overallScore > 60 ? "text-destructive" : selected.overallScore > 30 ? "text-warning" : "text-success"
                        }`}>
                          {selected.overallScore}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Recommended Actions</p>
                      <div className="rounded-lg border border-border p-3 text-xs text-card-foreground leading-relaxed">
                        {selected.mitigation}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(selected.factors).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-20 capitalize">{key}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${
                                val > 60 ? "bg-destructive" : val > 30 ? "bg-warning" : "bg-success"
                              }`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
