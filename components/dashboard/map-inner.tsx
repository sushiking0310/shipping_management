"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet"
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
  shipments?: { id: string; coords: [number, number]; status: string; origin: string; destination: string; carrier: string; eta: string }[]
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
        {shipments.map((s) => (
          <CircleMarker
            key={s.id}
            center={s.coords}
            radius={6}
            pathOptions={{
              color: statusColors[s.status] || "#6b7280",
              fillColor: statusColors[s.status] || "#6b7280",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-xs leading-relaxed" style={{ color: "#0f172a" }}>
                <div className="font-bold text-sm">{s.id}</div>
                <div>{s.origin} → {s.destination}</div>
                <div>Carrier: {s.carrier}</div>
                <div>ETA: {s.eta}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
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
