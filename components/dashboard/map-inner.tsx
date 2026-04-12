"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  "in-transit": "#3b82f6",
  "delivered": "#22c55e",
  "delayed": "#f59e0b",
  "at-risk": "#ef4444",
  "pending": "#6b7280",
}

function SetViewOnMount({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

interface MapInnerProps {
  shipments?: { id: string; coords: [number, number]; status: string; origin: string; destination: string; carrier: string; eta: string; mode?: string }[]
  routes?: { color: string; waypoints: [number, number][]; name: string }[]
  center?: [number, number]
  zoom?: number
  className?: string
}

export default function MapInner({
  shipments = [],
  routes = [],
  center = [20.5937, 78.9629],
  zoom = 4,
  className,
}: MapInnerProps) {
  return (
    <div className={cn("h-full w-full overflow-hidden rounded-lg", className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ background: "#0a0f1a" }}
      >
        <SetViewOnMount center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {shipments.map((s) => {
          const color = statusColors[s.status] || "#6b7280"
          const iconHtml = `
            <div class="relative flex h-5 w-5 items-center justify-center -ml-2.5 -mt-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style="background-color: ${color}"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white shadow-sm" style="background-color: ${color}"></span>
            </div>
          `
          const customIcon = L.divIcon({
            html: iconHtml,
            className: "", // Clear default leaflet classes
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          return (
            <Marker key={s.id} position={s.coords} icon={customIcon}>
              <Popup>
                <div className="text-xs leading-relaxed" style={{ color: "#0f172a" }}>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    {s.id}
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {s.mode || "Transport"}
                    </span>
                  </div>
                  <div className="mt-1">{s.origin} → {s.destination}</div>
                  <div>Carrier: {s.carrier}</div>
                  <div className="font-medium text-slate-700 mt-0.5">ETA: {s.eta}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.waypoints}
            pathOptions={{ color: r.color, weight: 3, opacity: 0.8, dashArray: i > 0 ? "8 6" : undefined }}
          >
            <Popup>
              <div className="text-xs font-medium" style={{ color: "#0f172a" }}>{r.name}</div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  )
}
