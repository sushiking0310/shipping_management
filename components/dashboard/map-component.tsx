"use client"

import dynamic from "next/dynamic"

const MapInner = dynamic(() => import("./map-inner"), { ssr: false })

interface MapComponentProps {
  shipments?: { id: string; coords: [number, number]; status: string; origin: string; destination: string; carrier: string; eta: string }[]
  routes?: { color: string; waypoints: [number, number][]; name: string }[]
  center?: [number, number]
  zoom?: number
  className?: string
}

export function MapComponent(props: MapComponentProps) {
  return <MapInner {...props} />
}
