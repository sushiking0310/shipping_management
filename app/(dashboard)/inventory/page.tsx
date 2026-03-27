"use client"

import { useState } from "react"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  ArrowUpDown,
  Clock,
  Boxes,
  Truck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { inventoryItems, inventoryForecast, warehouseCapacity } from "@/lib/mock-data"
import { KPICard } from "@/components/dashboard/kpi-card"

const categoryDistribution = [
  { name: "Electronics", value: 4200, fill: "var(--chart-1)" },
  { name: "Automotive", value: 3100, fill: "var(--chart-2)" },
  { name: "Apparel", value: 2800, fill: "var(--chart-3)" },
  { name: "Food & Bev", value: 2200, fill: "var(--chart-4)" },
  { name: "Medical", value: 1500, fill: "var(--chart-5)" },
]

const turnoverData = [
  { month: "Sep", rate: 4.2 },
  { month: "Oct", rate: 4.5 },
  { month: "Nov", rate: 5.1 },
  { month: "Dec", rate: 6.8 },
  { month: "Jan", rate: 5.4 },
  { month: "Feb", rate: 4.9 },
]

function getStockStatusColor(status: string) {
  switch (status) {
    case "Optimal":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "Low":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    case "Critical":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "Overstock":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function InventoryPage() {
  const [sortField, setSortField] = useState<string>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const totalItems = inventoryItems.reduce((s, i) => s + i.currentStock, 0)
  const lowStockCount = inventoryItems.filter((i) => i.stockStatus === "Low" || i.stockStatus === "Critical").length
  const avgTurnover = (turnoverData.reduce((s, t) => s + t.rate, 0) / turnoverData.length).toFixed(1)
  const totalValue = inventoryItems.reduce((s, i) => s + i.currentStock * i.unitCost, 0)

  const sorted = [...inventoryItems].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a]
    const bVal = b[sortField as keyof typeof b]
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Predictive Inventory</h1>
          <p className="text-muted-foreground">
            AI-powered demand forecasting and stock optimization
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Inventory
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Units"
          value={totalItems.toLocaleString()}
          change={8.3}
          trend="up"
          icon={<Boxes className="h-4 w-4" />}
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockCount.toString()}
          change={12}
          trend="down"
          icon={<AlertTriangle className="h-4 w-4" />}
          positiveIsGood={false}
        />
        <KPICard
          title="Avg Turnover Rate"
          value={`${avgTurnover}x`}
          change={8.5}
          trend="up"
          icon={<ArrowUpDown className="h-4 w-4" />}
        />
        <KPICard
          title="Inventory Value"
          value={`₹${(totalValue / 1000000).toFixed(1)}M`}
          change={12.1}
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Inventory Turnover Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={turnoverData}>
                      <defs>
                        <linearGradient id="turnoverGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        fill="url(#turnoverGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number, name: string) => [`${value.toLocaleString()} units`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        formatter={(value) => (
                          <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead>
                        <Button variant="ghost" size="sm" className="gap-1 -ml-3 text-xs" onClick={() => toggleSort("name")}>
                          Item Name
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="gap-1 -ml-3 text-xs" onClick={() => toggleSort("currentStock")}>
                          Current Stock
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Predicted Demand</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Unit Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sorted.map((item) => (
                      <TableRow key={item.sku} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{item.sku}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{item.currentStock.toLocaleString()}</span>
                            <Progress
                              value={Math.min((item.currentStock / (item.reorderPoint * 3)) * 100, 100)}
                              className="h-1.5 w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{item.reorderPoint.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStockStatusColor(item.stockStatus)}>
                            {item.stockStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {item.predictedDemand > item.currentStock ? (
                              <TrendingUp className="h-3 w-3 text-amber-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-emerald-400" />
                            )}
                            {item.predictedDemand.toLocaleString()} / mo
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {item.leadTimeDays}d
                          </div>
                        </TableCell>
                        <TableCell>₹{item.unitCost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                30-Day Demand Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventoryForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                      name="Predicted Demand"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                      name="Actual Demand"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="safety"
                      stroke="var(--chart-4)"
                      strokeWidth={1}
                      dot={false}
                      name="Safety Stock"
                      strokeDasharray="3 3"
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
                    <p className="text-2xl font-bold">94.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                    <RefreshCw className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Auto-Reorders Pending</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stockout Risk Items</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {warehouseCapacity.map((wh) => (
              <Card key={wh.id} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      {wh.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        wh.utilization > 90
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : wh.utilization > 75
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }
                    >
                      {wh.utilization}% utilized
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Capacity</span>
                      <span>
                        {wh.currentUnits.toLocaleString()} / {wh.totalCapacity.toLocaleString()} units
                      </span>
                    </div>
                    <Progress value={wh.utilization} className="h-2" />
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wh.monthlyThroughput}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            color: "var(--foreground)",
                          }}
                        />
                        <Bar dataKey="inbound" fill="var(--chart-1)" radius={[3, 3, 0, 0]} name="Inbound" />
                        <Bar dataKey="outbound" fill="var(--chart-2)" radius={[3, 3, 0, 0]} name="Outbound" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Zones</p>
                      <p className="font-semibold">{wh.zones}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Staff</p>
                      <p className="font-semibold">{wh.staff}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Efficiency</p>
                      <p className="font-semibold">{wh.efficiency}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
