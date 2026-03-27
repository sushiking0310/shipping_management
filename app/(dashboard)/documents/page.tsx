"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { documents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  FileCheck2,
  FileClock,
  FileWarning,
  Eye,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function DocumentsPage() {
  const [filter, setFilter] = useState<string>("all")
  const [previewDoc, setPreviewDoc] = useState<typeof documents[0] | null>(null)

  const filtered = useMemo(() => {
    if (filter === "all") return documents
    return documents.filter((d) => d.status === filter)
  }, [filter])

  const stats = useMemo(() => {
    const total = documents.length
    const validated = documents.filter((d) => d.status === "validated").length
    const generated = documents.filter((d) => d.status === "generated").length
    const pending = documents.filter((d) => d.status === "pending").length
    const errors = documents.filter((d) => d.status === "error").length
    const avgCompliance = documents.filter((d) => d.complianceScore > 0).reduce((a, d) => a + d.complianceScore, 0) / (total - pending) || 0
    return { total, validated, generated, pending, errors, avgCompliance }
  }, [])

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Automated Documentation & Compliance" />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <FileCheck2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Validated</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.validated}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Auto-Generated</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.generated}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <FileClock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.pending}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <FileWarning className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Errors</p>
                  <p className="text-xl font-bold font-mono text-card-foreground">{stats.errors}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance bar */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-card-foreground">Overall Compliance Score</span>
                <span className="text-sm font-bold font-mono text-card-foreground">{stats.avgCompliance.toFixed(1)}%</span>
              </div>
              <Progress value={stats.avgCompliance} className="h-2" />
              <p className="mt-2 text-[10px] text-muted-foreground">
                Based on {stats.total - stats.pending} documents with compliance checks completed.
              </p>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex gap-1.5">
            {["all", "validated", "generated", "pending", "error"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                size="sm"
                onClick={() => setFilter(f)}
                className="h-7 px-3 text-[11px] capitalize"
              >
                {f === "all" ? "All Documents" : f}
              </Button>
            ))}
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Doc ID</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Shipment</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Compliance</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-medium text-card-foreground">{d.id}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.type}</td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{d.shipmentId}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{d.date}</td>
                        <td className="px-4 py-2.5">
                          {d.complianceScore > 0 ? (
                            <div className="flex items-center gap-2">
                              <Progress value={d.complianceScore} className="h-1 w-16" />
                              <span className={`text-[10px] font-mono font-medium ${
                                d.complianceScore >= 90 ? "text-success" :
                                d.complianceScore >= 70 ? "text-warning" : "text-destructive"
                              }`}>
                                {d.complianceScore}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">--</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => setPreviewDoc(d)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">View document</span>
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

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">{previewDoc?.type}</DialogTitle>
            <DialogDescription>
              Document {previewDoc?.id} for shipment {previewDoc?.shipmentId}
            </DialogDescription>
          </DialogHeader>
          {previewDoc && (
            <div className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-[10px] text-muted-foreground">Status</p>
                  <div className="mt-1"><StatusBadge status={previewDoc.status} /></div>
                </div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-[10px] text-muted-foreground">Created</p>
                  <p className="mt-1 font-mono text-card-foreground">{previewDoc.date}</p>
                </div>
              </div>
              {previewDoc.complianceScore > 0 && (
                <div className="rounded-md bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] text-muted-foreground">Compliance Score</p>
                    <span className="text-xs font-mono font-medium text-card-foreground">{previewDoc.complianceScore}%</span>
                  </div>
                  <Progress value={previewDoc.complianceScore} className="h-1.5" />
                </div>
              )}
              <div className="rounded-md border border-border p-4 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-[10px] text-muted-foreground">Document content preview would appear here in production.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
