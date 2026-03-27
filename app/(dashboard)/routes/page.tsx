"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { MapComponent } from "@/components/dashboard/map-component"
import { routeOptions } from "@/lib/mock-data"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, Clock, Fuel, CloudRain, Trophy } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState(routeOptions[0].id)
  const [speedWeight, setSpeedWeight] = useState([50])
  const [costWeight, setCostWeight] = useState([30])
  const [safetyWeight, setSafetyWeight] = useState([20])

  const mapRoutes = routeOptions.map((r) => ({
    color: r.id === selectedRoute ? r.color : `${r.color}66`,
    waypoints: r.waypoints,
    name: r.name,
  }))

  const comparisonData = routeOptions.map((r) => ({
    name: r.name,
    distance: r.distance,
    time: r.estimatedTime * 100,
    cost: r.fuelCost / 100,
  }))

  const radarData = [
    { metric: "Speed", ...Object.fromEntries(routeOptions.map((r) => [r.name, Math.round((1 - r.estimatedTime / 20) * 100)])) },
    { metric: "Cost", ...Object.fromEntries(routeOptions.map((r) => [r.name, Math.round((1 - r.fuelCost / 50000) * 100)])) },
    { metric: "Safety", ...Object.fromEntries(routeOptions.map((r) => [r.name, Math.round((1 - r.weatherRisk) * 100)])) },
    { metric: "Distance", ...Object.fromEntries(routeOptions.map((r) => [r.name, Math.round((1 - r.distance / 15000) * 100)])) },
    { metric: "Score", ...Object.fromEntries(routeOptions.map((r) => [r.name, r.overallScore])) },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Smart Route Optimization" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Map with routes */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-card-foreground">Route Comparison: Delhi to Mumbai</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-[340px]">
                <MapComponent routes={mapRoutes} center={[20.5937, 78.9629]} zoom={4} />
              </div>
            </CardContent>
          </Card>

          {/* Route Cards */}
          <div className="grid gap-3 md:grid-cols-3">
            {routeOptions.map((r) => (
              <Card
                key={r.id}
                onClick={() => setSelectedRoute(r.id)}
                className={`bg-card border-border cursor-pointer transition-all ${
                  selectedRoute === r.id ? "ring-2 ring-primary border-primary" : "hover:border-muted-foreground/30"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-sm font-semibold text-card-foreground">{r.name}</span>
                    {selectedRoute === r.id && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">Distance</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">{r.distance.toLocaleString()} km</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" />Est. Time</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">{r.estimatedTime} days</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Fuel className="h-2.5 w-2.5" />Fuel Cost</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">₹{r.fuelCost.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><CloudRain className="h-2.5 w-2.5" />Weather Risk</span>
                      <span className={`text-xs font-mono font-medium ${r.weatherRisk > 0.3 ? "text-destructive" : r.weatherRisk > 0.1 ? "text-warning" : "text-success"}`}>
                        {(r.weatherRisk * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-secondary/50 px-2.5 py-1.5">
                    <Trophy className="h-3 w-3 text-primary" />
                    <span className="text-[10px] text-muted-foreground">Overall Score</span>
                    <span className="ml-auto text-sm font-bold font-mono text-card-foreground">{r.overallScore}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts + Controls */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Route Metrics Radar</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.25 0.01 260)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "oklch(0.6 0.01 260)" }} />
                      <PolarRadiusAxis tick={{ fontSize: 9, fill: "oklch(0.4 0.01 260)" }} domain={[0, 100]} />
                      {routeOptions.map((r) => (
                        <Radar
                          key={r.id}
                          name={r.name}
                          dataKey={r.name}
                          stroke={r.color}
                          fill={r.color}
                          fillOpacity={r.id === selectedRoute ? 0.2 : 0.05}
                          strokeWidth={r.id === selectedRoute ? 2 : 1}
                        />
                      ))}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.17 0.015 260)",
                          border: "1px solid oklch(0.25 0.01 260)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "oklch(0.95 0.01 260)",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Cost vs Time Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "oklch(0.6 0.01 260)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.17 0.015 260)",
                          border: "1px solid oklch(0.25 0.01 260)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "oklch(0.95 0.01 260)",
                        }}
                      />
                      <Bar dataKey="cost" name="Cost (₹100s)" fill="oklch(0.65 0.2 260)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="time" name="Time (hrs)" fill="oklch(0.75 0.15 75)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-card-foreground">Priority Weights</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-col gap-5 mt-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Speed Priority</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">{speedWeight[0]}%</span>
                    </div>
                    <Slider value={speedWeight} onValueChange={setSpeedWeight} max={100} step={5} className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Cost Priority</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">{costWeight[0]}%</span>
                    </div>
                    <Slider value={costWeight} onValueChange={setCostWeight} max={100} step={5} className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Safety Priority</span>
                      <span className="text-xs font-mono font-medium text-card-foreground">{safetyWeight[0]}%</span>
                    </div>
                    <Slider value={safetyWeight} onValueChange={setSafetyWeight} max={100} step={5} className="w-full" />
                  </div>
                  <div className="mt-2 rounded-lg bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground mb-2">Recommended Route</p>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: routeOptions[0].color }} />
                      <span className="text-sm font-semibold text-card-foreground">{routeOptions[0].name}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Best balance of transit time and weather safety for current conditions.
                    </p>
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
