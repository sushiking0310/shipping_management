// ==========================================
// Smart Shipping Management Platform
import { generateInventoryForecastDataStatic } from "./generateInventoryForecastDataStatic"
// Comprehensive Mock Data
// ==========================================

export type ShipmentStatus = "in-transit" | "delivered" | "delayed" | "at-risk" | "pending"

export interface Shipment {
  id: string
  origin: string
  originCoords: [number, number]
  destination: string
  destinationCoords: [number, number]
  currentCoords: [number, number]
  carrier: string
  status: ShipmentStatus
  eta: string
  departureDate: string
  delayProbability: number
  riskScore: number
  weight: number
  value: number
  mode: "sea" | "air" | "road" | "rail"
  customer: string
  progress: number
}

export interface RouteOption {
  id: string
  name: string
  distance: number
  estimatedTime: number
  fuelCost: number
  weatherRisk: number
  overallScore: number
  color: string
  waypoints: [number, number][]
}

export interface Document {
  id: string
  type: string
  shipmentId: string
  status: "generated" | "pending" | "validated" | "error"
  date: string
  complianceScore: number
}

export interface RiskFactor {
  delay: number
  damage: number
  theft: number
  compliance: number
  weather: number
}

export interface ShipmentRisk {
  shipmentId: string
  overallScore: number
  factors: RiskFactor
  mitigation: string
  trend: "increasing" | "decreasing" | "stable"
}

export interface Decision {
  id: string
  shipmentId: string
  type: string
  carrier: string
  mode: string
  route: string
  reasoning: string
  status: "applied" | "pending-review" | "overridden"
  timestamp: string
  savings: number
}

export interface PricingLane {
  id: string
  origin: string
  destination: string
  baseRate: number
  currentRate: number
  multiplier: number
  demand: "high" | "medium" | "low"
  capacityUtilization: number
}

export interface FraudAlert {
  id: string
  shipmentId: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  description: string
  timestamp: string
  status: "active" | "resolved" | "investigating" | "false-positive"
  confidence: number
}

export interface Warehouse {
  id: string
  name: string
  location: string
  coords: [number, number]
  totalCapacity: number
  utilized: number
  zones: { name: string; capacity: number; utilized: number }[]
}

export interface InventoryForecast {
  date: string
  predicted: number
  actual: number | null
}

// ==========================================
// SHIPMENTS
// ==========================================
export const shipments: Shipment[] = [

  {
    id: "SHP-001",
    origin: "Mumbai, India",
    originCoords: [19.076, 72.8777],
    destination: "Kolkata, India",
    destinationCoords: [22.5726, 88.3639],
    currentCoords: [21.3488, 82.9437],
    carrier: "Maersk Line",
    status: "in-transit",
    eta: "2026-03-05",
    departureDate: "2026-02-10",
    delayProbability: 0.12,
    riskScore: 28,
    weight: 24500,
    value: 485000,
    mode: "sea",
    customer: "TechGlobal Inc.",
    progress: 65,
  },
  {
    id: "SHP-002",
    origin: "Delhi, India",
    originCoords: [28.7041, 77.1025],
    destination: "Kolkata, India",
    destinationCoords: [22.5726, 88.3639],
    currentCoords: [24.2894, 85.2107],
    carrier: "MSC",
    status: "in-transit",
    eta: "2026-02-28",
    departureDate: "2026-02-12",
    delayProbability: 0.08,
    riskScore: 15,
    weight: 18200,
    value: 320000,
    mode: "sea",
    customer: "EuroTrade Ltd.",
    progress: 72,
  },
  {
    id: "SHP-003",
    origin: "Bangalore, India",
    originCoords: [12.9716, 77.5946],
    destination: "Hyderabad, India",
    destinationCoords: [17.385, 78.4867],
    currentCoords: [14.9576, 77.9960],
    carrier: "Emirates Shipping",
    status: "delayed",
    eta: "2026-02-24",
    departureDate: "2026-02-15",
    delayProbability: 0.75,
    riskScore: 68,
    weight: 8900,
    value: 175000,
    mode: "sea",
    customer: "Subcontinent Imports",
    progress: 45,
  },
  {
    id: "SHP-004",
    origin: "Chennai, India",
    originCoords: [13.0827, 80.2707],
    destination: "Mumbai, India",
    destinationCoords: [19.076, 72.8777],
    currentCoords: [16.3790, 76.2046],
    carrier: "NYK Line",
    status: "in-transit",
    eta: "2026-03-01",
    departureDate: "2026-02-14",
    delayProbability: 0.05,
    riskScore: 12,
    weight: 15600,
    value: 290000,
    mode: "sea",
    customer: "Pacific Goods Co.",
    progress: 55,
  },
  {
    id: "SHP-005",
    origin: "Kolkata, India",
    originCoords: [22.5726, 88.3639],
    destination: "Chennai, India",
    destinationCoords: [13.0827, 80.2707],
    currentCoords: [18.7766, 85.1266],
    carrier: "Hapag-Lloyd",
    status: "at-risk",
    eta: "2026-03-10",
    departureDate: "2026-02-08",
    delayProbability: 0.62,
    riskScore: 72,
    weight: 31000,
    value: 520000,
    mode: "sea",
    customer: "German Auto Parts GmbH",
    progress: 40,
  },
  {
    id: "SHP-006",
    origin: "Hyderabad, India",
    originCoords: [17.385, 78.4867],
    destination: "Delhi, India",
    destinationCoords: [28.7041, 77.1025],
    currentCoords: [24.1765, 77.6562],
    carrier: "FedEx Express",
    status: "in-transit",
    eta: "2026-02-23",
    departureDate: "2026-02-20",
    delayProbability: 0.03,
    riskScore: 8,
    weight: 450,
    value: 95000,
    mode: "air",
    customer: "UK Electronics Dist.",
    progress: 60,
  },
  {
    id: "SHP-007",
    origin: "Mumbai, India",
    originCoords: [19.076, 72.8777],
    destination: "Chennai, India",
    destinationCoords: [13.0827, 80.2707],
    currentCoords: [17.2780, 75.0956],
    carrier: "LATAM Cargo",
    status: "in-transit",
    eta: "2026-02-22",
    departureDate: "2026-02-21",
    delayProbability: 0.15,
    riskScore: 22,
    weight: 2800,
    value: 68000,
    mode: "air",
    customer: "Tropical Exports LLC",
    progress: 30,
  },
  {
    id: "SHP-008",
    origin: "Delhi, India",
    originCoords: [28.7041, 77.1025],
    destination: "Hyderabad, India",
    destinationCoords: [17.385, 78.4867],
    currentCoords: [23.0446, 77.7946],
    carrier: "J.B. Hunt",
    status: "in-transit",
    eta: "2026-02-22",
    departureDate: "2026-02-21",
    delayProbability: 0.1,
    riskScore: 10,
    weight: 12000,
    value: 45000,
    mode: "road",
    customer: "Midwest Supply Co.",
    progress: 50,
  },
  {
    id: "SHP-009",
    origin: "Bangalore, India",
    originCoords: [12.9716, 77.5946],
    destination: "Hyderabad, India",
    destinationCoords: [17.385, 78.4867],
    currentCoords: [17.3850, 78.4867],
    carrier: "Shipping Corp. of India",
    status: "delivered",
    eta: "2026-02-19",
    departureDate: "2026-02-16",
    delayProbability: 0,
    riskScore: 0,
    weight: 5500,
    value: 82000,
    mode: "sea",
    customer: "Lanka Trading",
    progress: 100,
  },
  {
    id: "SHP-010",
    origin: "Chennai, India",
    originCoords: [13.0827, 80.2707],
    destination: "Mumbai, India",
    destinationCoords: [19.076, 72.8777],
    currentCoords: [19.0760, 72.8777],
    carrier: "DB Schenker",
    status: "delivered",
    eta: "2026-02-20",
    departureDate: "2026-02-18",
    delayProbability: 0,
    riskScore: 0,
    weight: 7800,
    value: 125000,
    mode: "rail",
    customer: "Euro Logistics Sp.",
    progress: 100,
  },
  {
    id: "SHP-011",
    origin: "Kolkata, India",
    originCoords: [22.5726, 88.3639],
    destination: "Bangalore, India",
    destinationCoords: [12.9716, 77.5946],
    currentCoords: [17.7721, 82.9793],
    carrier: "HMM",
    status: "at-risk",
    eta: "2026-03-08",
    departureDate: "2026-02-12",
    delayProbability: 0.55,
    riskScore: 65,
    weight: 22000,
    value: 410000,
    mode: "sea",
    customer: "Canada Pacific Trade",
    progress: 50,
  },
  {
    id: "SHP-012",
    origin: "Hyderabad, India",
    originCoords: [17.385, 78.4867],
    destination: "Mumbai, India",
    destinationCoords: [19.076, 72.8777],
    currentCoords: [17.9769, 76.5236],
    carrier: "COSCO",
    status: "in-transit",
    eta: "2026-02-25",
    departureDate: "2026-02-19",
    delayProbability: 0.09,
    riskScore: 18,
    weight: 16800,
    value: 230000,
    mode: "sea",
    customer: "Indo-China Commerce",
    progress: 35,
  },
  {
    id: "SHP-013",
    origin: "Mumbai, India",
    originCoords: [19.076, 72.8777],
    destination: "Chennai, India",
    destinationCoords: [13.0827, 80.2707],
    currentCoords: [15.4800, 77.3135],
    carrier: "Turkon Line",
    status: "delayed",
    eta: "2026-02-26",
    departureDate: "2026-02-17",
    delayProbability: 0.68,
    riskScore: 58,
    weight: 9200,
    value: 145000,
    mode: "sea",
    customer: "Nile Delta Imports",
    progress: 60,
  },
  {
    id: "SHP-014",
    origin: "Delhi, India",
    originCoords: [28.7041, 77.1025],
    destination: "Mumbai, India",
    destinationCoords: [19.076, 72.8777],
    currentCoords: [24.3715, 75.2013],
    carrier: "Matson",
    status: "in-transit",
    eta: "2026-02-26",
    departureDate: "2026-02-20",
    delayProbability: 0.04,
    riskScore: 6,
    weight: 8500,
    value: 155000,
    mode: "sea",
    customer: "Aloha Distributors",
    progress: 45,
  },
  {
    id: "SHP-015",
    origin: "Bangalore, India",
    originCoords: [12.9716, 77.5946],
    destination: "Mumbai, India",
    destinationCoords: [19.076, 72.8777],
    currentCoords: [19.0760, 72.8777],
    carrier: "ANL Container",
    status: "delivered",
    eta: "2026-02-18",
    departureDate: "2026-02-15",
    delayProbability: 0,
    riskScore: 0,
    weight: 4200,
    value: 68000,
    mode: "sea",
    customer: "Kiwi Imports NZ",
    progress: 100,
  },
  {
    id: "SHP-016",
    origin: "Chennai, India",
    originCoords: [13.0827, 80.2707],
    destination: "Delhi, India",
    destinationCoords: [28.7041, 77.1025],
    currentCoords: [21.6745, 78.5282],
    carrier: "DHL Express",
    status: "in-transit",
    eta: "2026-02-22",
    departureDate: "2026-02-21",
    delayProbability: 0.06,
    riskScore: 9,
    weight: 3200,
    value: 210000,
    mode: "road",
    customer: "Italian Fashion House",
    progress: 55,
  },
  {
    id: "SHP-017",
    origin: "Kolkata, India",
    originCoords: [22.5726, 88.3639],
    destination: "Chennai, India",
    destinationCoords: [13.0827, 80.2707],
    currentCoords: [21.6236, 87.5546],
    carrier: "Safmarine",
    status: "pending",
    eta: "2026-03-12",
    departureDate: "2026-02-22",
    delayProbability: 0.2,
    riskScore: 30,
    weight: 19500,
    value: 275000,
    mode: "sea",
    customer: "SA Industrial Group",
    progress: 10,
  },
  {
    id: "SHP-018",
    origin: "Hyderabad, India",
    originCoords: [17.385, 78.4867],
    destination: "Kolkata, India",
    destinationCoords: [22.5726, 88.3639],
    currentCoords: [21.0163, 85.4007],
    carrier: "Evergreen Marine",
    status: "in-transit",
    eta: "2026-03-02",
    departureDate: "2026-02-13",
    delayProbability: 0.11,
    riskScore: 20,
    weight: 27800,
    value: 680000,
    mode: "sea",
    customer: "Silicon Valley Tech",
    progress: 70,
  },
  {
    id: "SHP-019",
    origin: "Mumbai, India",
    originCoords: [19.076, 72.8777],
    destination: "Hyderabad, India",
    destinationCoords: [17.385, 78.4867],
    currentCoords: [18.0614, 76.2431],
    carrier: "ONE Line",
    status: "in-transit",
    eta: "2026-02-27",
    departureDate: "2026-02-18",
    delayProbability: 0.07,
    riskScore: 14,
    weight: 11000,
    value: 195000,
    mode: "sea",
    customer: "Osaka Trading Corp.",
    progress: 60,
  },
  {
    id: "SHP-020",
    origin: "Delhi, India",
    originCoords: [28.7041, 77.1025],
    destination: "Chennai, India",
    destinationCoords: [13.0827, 80.2707],
    currentCoords: [20.1123, 78.8450],
    carrier: "PIL",
    status: "delayed",
    eta: "2026-03-04",
    departureDate: "2026-02-11",
    delayProbability: 0.72,
    riskScore: 70,
    weight: 14500,
    value: 195000,
    mode: "sea",
    customer: "Atlantic Commerce",
    progress: 55,
  },

]

// ==========================================
// ROUTE OPTIONS (for Route Optimization page)
// ==========================================
export const routeOptions: RouteOption[] = [
  {
    id: "route-1",
    name: "Western Corridor",
    distance: 1400,
    estimatedTime: 2,
    fuelCost: 1250,
    weatherRisk: 0.15,
    overallScore: 92,
    color: "#3b82f6",
    waypoints: [
      [28.7041, 77.1025], // Delhi
      [26.9124, 75.7873], // Jaipur
      [23.0225, 72.5714], // Ahmedabad
      [19.0760, 72.8777], // Mumbai
    ],
  },
  {
    id: "route-2",
    name: "Southern Express",
    distance: 1000,
    estimatedTime: 1.5,
    fuelCost: 890,
    weatherRisk: 0.08,
    overallScore: 85,
    color: "#10b981",
    waypoints: [
      [19.0760, 72.8777], // Mumbai
      [18.5204, 73.8567], // Pune
      [12.9716, 77.5946], // Bangalore
      [13.0827, 80.2707], // Chennai
    ],
  },
  {
    id: "route-3",
    name: "Eastern Arc",
    distance: 1500,
    estimatedTime: 2.2,
    fuelCost: 1420,
    weatherRisk: 0.45,
    overallScore: 74,
    color: "#f59e0b",
    waypoints: [
      [28.7041, 77.1025], // Delhi
      [26.8467, 80.9462], // Lucknow
      [25.5941, 85.1376], // Patna
      [22.5726, 88.3639], // Kolkata
    ],
  },
]

// ==========================================
// DOCUMENTS
// ==========================================
export const documents: Document[] = [
  { id: "DOC-001", type: "Bill of Lading", shipmentId: "SHP-001", status: "validated", date: "2026-02-10", complianceScore: 98 },
  { id: "DOC-002", type: "Commercial Invoice", shipmentId: "SHP-001", status: "validated", date: "2026-02-10", complianceScore: 100 },
  { id: "DOC-003", type: "Customs Declaration", shipmentId: "SHP-001", status: "generated", date: "2026-02-10", complianceScore: 95 },
  { id: "DOC-004", type: "Packing List", shipmentId: "SHP-002", status: "validated", date: "2026-02-12", complianceScore: 100 },
  { id: "DOC-005", type: "Bill of Lading", shipmentId: "SHP-002", status: "validated", date: "2026-02-12", complianceScore: 97 },
  { id: "DOC-006", type: "Insurance Certificate", shipmentId: "SHP-003", status: "pending", date: "2026-02-15", complianceScore: 0 },
  { id: "DOC-007", type: "Customs Declaration", shipmentId: "SHP-003", status: "error", date: "2026-02-15", complianceScore: 42 },
  { id: "DOC-008", type: "Bill of Lading", shipmentId: "SHP-004", status: "validated", date: "2026-02-14", complianceScore: 100 },
  { id: "DOC-009", type: "Commercial Invoice", shipmentId: "SHP-005", status: "generated", date: "2026-02-08", complianceScore: 88 },
  { id: "DOC-010", type: "Certificate of Origin", shipmentId: "SHP-005", status: "pending", date: "2026-02-08", complianceScore: 0 },
  { id: "DOC-011", type: "Packing List", shipmentId: "SHP-006", status: "validated", date: "2026-02-20", complianceScore: 100 },
  { id: "DOC-012", type: "Bill of Lading", shipmentId: "SHP-007", status: "generated", date: "2026-02-21", complianceScore: 92 },
  { id: "DOC-013", type: "Dangerous Goods Decl.", shipmentId: "SHP-008", status: "validated", date: "2026-02-21", complianceScore: 100 },
  { id: "DOC-014", type: "Commercial Invoice", shipmentId: "SHP-009", status: "validated", date: "2026-02-16", complianceScore: 100 },
  { id: "DOC-015", type: "Customs Declaration", shipmentId: "SHP-010", status: "validated", date: "2026-02-18", complianceScore: 99 },
  { id: "DOC-016", type: "Insurance Certificate", shipmentId: "SHP-011", status: "error", date: "2026-02-12", complianceScore: 35 },
  { id: "DOC-017", type: "Bill of Lading", shipmentId: "SHP-012", status: "generated", date: "2026-02-19", complianceScore: 94 },
  { id: "DOC-018", type: "Packing List", shipmentId: "SHP-013", status: "pending", date: "2026-02-17", complianceScore: 0 },
]

// ==========================================
// RISK DATA
// ==========================================
export const shipmentRisks: ShipmentRisk[] = [
  { shipmentId: "SHP-001", overallScore: 28, factors: { delay: 25, damage: 15, theft: 10, compliance: 35, weather: 30 }, mitigation: "Monitor Monsoon weather patterns. Reroute if typhoon warning issued.", trend: "stable" },
  { shipmentId: "SHP-002", overallScore: 15, factors: { delay: 12, damage: 8, theft: 5, compliance: 20, weather: 18 }, mitigation: "Standard monitoring sufficient. Low risk route.", trend: "decreasing" },
  { shipmentId: "SHP-003", overallScore: 68, factors: { delay: 80, damage: 45, theft: 30, compliance: 70, weather: 55 }, mitigation: "Engage backup carrier. Alert customs for expedited processing.", trend: "increasing" },
  { shipmentId: "SHP-004", overallScore: 12, factors: { delay: 10, damage: 8, theft: 5, compliance: 15, weather: 12 }, mitigation: "No immediate action required.", trend: "stable" },
  { shipmentId: "SHP-005", overallScore: 72, factors: { delay: 75, damage: 50, theft: 35, compliance: 80, weather: 65 }, mitigation: "Reroute via Suez Canal. Increase security escort. Rush compliance docs.", trend: "increasing" },
  { shipmentId: "SHP-006", overallScore: 8, factors: { delay: 5, damage: 3, theft: 12, compliance: 8, weather: 5 }, mitigation: "Standard air cargo monitoring.", trend: "decreasing" },
  { shipmentId: "SHP-007", overallScore: 22, factors: { delay: 20, damage: 18, theft: 10, compliance: 25, weather: 30 }, mitigation: "Monitor tropical weather systems in Indian Ocean.", trend: "stable" },
  { shipmentId: "SHP-011", overallScore: 65, factors: { delay: 70, damage: 40, theft: 20, compliance: 60, weather: 75 }, mitigation: "Bay of Bengal Route storm warning active. Consider holding shipment at waypoint.", trend: "increasing" },
  { shipmentId: "SHP-013", overallScore: 58, factors: { delay: 65, damage: 35, theft: 45, compliance: 55, weather: 40 }, mitigation: "Customs backlog at Mundra Port. Pre-clear documentation.", trend: "stable" },
  { shipmentId: "SHP-020", overallScore: 70, factors: { delay: 80, damage: 55, theft: 60, compliance: 65, weather: 50 }, mitigation: "High piracy risk zone. Engage naval escort. Reroute west of Andaman & Nicobar Islands.", trend: "increasing" },
]

// ==========================================
// DECISIONS
// ==========================================
export const decisions: Decision[] = [
  { id: "DEC-001", shipmentId: "SHP-001", type: "Carrier Selection", carrier: "Maersk Line", mode: "Sea", route: "Pacific Express", reasoning: "Lowest transit time with acceptable weather risk. 15% cost savings vs. air freight.", status: "applied", timestamp: "2026-02-09T08:30:00Z", savings: 28500 },
  { id: "DEC-002", shipmentId: "SHP-003", type: "Re-routing", carrier: "Emirates Shipping", mode: "Sea", route: "Konkan Coastal", reasoning: "Port congestion detected at original route. Alternative saves 2 days.", status: "applied", timestamp: "2026-02-18T14:15:00Z", savings: 12000 },
  { id: "DEC-003", shipmentId: "SHP-005", type: "Mode Change", carrier: "Hapag-Lloyd", mode: "Sea + Rail", route: "Western Freight Corridor", reasoning: "Risk score exceeded threshold. Hybrid mode reduces exposure time.", status: "pending-review", timestamp: "2026-02-20T11:00:00Z", savings: 8500 },
  { id: "DEC-004", shipmentId: "SHP-006", type: "Carrier Selection", carrier: "FedEx Express", mode: "Air", route: "Delhi-Mumbai Expressway", reasoning: "High-value electronics. Air transport minimizes damage and theft risk.", status: "applied", timestamp: "2026-02-19T09:45:00Z", savings: 5200 },
  { id: "DEC-005", shipmentId: "SHP-008", type: "Route Optimization", carrier: "J.B. Hunt", mode: "Road", route: "NH-44 South", reasoning: "Highway construction on NH-48. Alternative route saves 3 hours.", status: "applied", timestamp: "2026-02-21T06:20:00Z", savings: 1800 },
  { id: "DEC-006", shipmentId: "SHP-011", type: "Carrier Escalation", carrier: "HMM → Maersk", mode: "Sea", route: "Bay of Bengal Route", reasoning: "Weather alert triggered carrier backup plan. Maersk vessel has better rating for storm conditions.", status: "overridden", timestamp: "2026-02-19T16:30:00Z", savings: -4200 },
  { id: "DEC-007", shipmentId: "SHP-012", type: "Carrier Selection", carrier: "COSCO", mode: "Sea", route: "Arabian Sea Direct", reasoning: "Best price-performance for short-haul. 98.5% on-time record on this lane.", status: "applied", timestamp: "2026-02-18T10:00:00Z", savings: 6100 },
  { id: "DEC-008", shipmentId: "SHP-018", type: "Speed Upgrade", carrier: "Evergreen Marine", mode: "Sea Express", route: "Golden Quadrilateral Fast", reasoning: "Customer requested expedited delivery. Revenue covers premium.", status: "applied", timestamp: "2026-02-13T07:15:00Z", savings: 15000 },
  { id: "DEC-009", shipmentId: "SHP-020", type: "Security Upgrade", carrier: "PIL", mode: "Sea", route: "East Coast Route", reasoning: "Piracy risk above threshold. Naval escort and western route mandated.", status: "pending-review", timestamp: "2026-02-20T13:45:00Z", savings: -2800 },
  { id: "DEC-010", shipmentId: "SHP-017", type: "Warehouse Staging", carrier: "Safmarine", mode: "Sea", route: "Indian Ocean Direct", reasoning: "Destination port capacity limited. Pre-stage at JNPT Hub.", status: "applied", timestamp: "2026-02-21T15:00:00Z", savings: 9200 },
]

// ==========================================
// PRICING LANES
// ==========================================
export const pricingLanes: PricingLane[] = [
  { id: "LN-01", origin: "Mumbai", destination: "Delhi", baseRate: 2.45, currentRate: 3.12, multiplier: 1.27, demand: "high", capacityUtilization: 92 },
  { id: "LN-02", origin: "Chennai", destination: "Kolkata", baseRate: 2.80, currentRate: 3.08, multiplier: 1.10, demand: "medium", capacityUtilization: 78 },
  { id: "LN-03", origin: "Bangalore", destination: "Hyderabad", baseRate: 2.10, currentRate: 2.73, multiplier: 1.30, demand: "high", capacityUtilization: 95 },
  { id: "LN-04", origin: "Kochi", destination: "Mumbai", baseRate: 1.55, currentRate: 1.70, multiplier: 1.10, demand: "medium", capacityUtilization: 68 },
  { id: "LN-05", origin: "Pune", destination: "Ahmedabad", baseRate: 1.85, currentRate: 1.92, multiplier: 1.04, demand: "low", capacityUtilization: 52 },
  { id: "LN-06", origin: "Surat", destination: "Jaipur", baseRate: 2.30, currentRate: 3.45, multiplier: 1.50, demand: "high", capacityUtilization: 98 },
  { id: "LN-07", origin: "Lucknow", destination: "Kanpur", baseRate: 4.20, currentRate: 4.62, multiplier: 1.10, demand: "medium", capacityUtilization: 75 },
  { id: "LN-08", origin: "Chennai", destination: "Visakhapatnam", baseRate: 1.40, currentRate: 1.47, multiplier: 1.05, demand: "low", capacityUtilization: 45 },
  { id: "LN-09", origin: "Indore", destination: "Bhopal", baseRate: 1.20, currentRate: 1.38, multiplier: 1.15, demand: "medium", capacityUtilization: 72 },
  { id: "LN-10", origin: "Patna", destination: "Ranchi", baseRate: 1.95, currentRate: 2.53, multiplier: 1.30, demand: "high", capacityUtilization: 88 },
]

// ==========================================
// FRAUD ALERTS
// ==========================================
export const fraudAlerts: FraudAlert[] = [
  { id: "FRD-001", shipmentId: "SHP-005", severity: "critical", type: "Documentation Fraud", description: "Inconsistent weight declarations between origin and transit checkpoints. Variance exceeds 18%.", timestamp: "2026-02-20T09:12:00Z", status: "active", confidence: 94 },
  { id: "FRD-002", shipmentId: "SHP-003", severity: "high", type: "Seal Tampering", description: "Container seal integrity sensor triggered at Port of Kochi transit point.", timestamp: "2026-02-19T15:42:00Z", status: "investigating", confidence: 87 },
  { id: "FRD-003", shipmentId: "SHP-020", severity: "high", type: "Customs Anomaly", description: "Declared goods category mismatch with shipping manifest. Possible classification fraud.", timestamp: "2026-02-18T11:30:00Z", status: "active", confidence: 82 },
  { id: "FRD-004", shipmentId: "SHP-011", severity: "medium", type: "Weight Tampering", description: "Gradual weight decrease detected across multiple checkpoints. Possible diversion.", timestamp: "2026-02-17T08:20:00Z", status: "investigating", confidence: 71 },
  { id: "FRD-005", shipmentId: "SHP-013", severity: "medium", type: "Route Deviation", description: "AIS signal shows unauthorized route deviation of 45nm from planned course.", timestamp: "2026-02-20T22:15:00Z", status: "active", confidence: 78 },
  { id: "FRD-006", shipmentId: "SHP-007", severity: "low", type: "Documentation Anomaly", description: "Minor discrepancy in shipper address between invoice and bill of lading.", timestamp: "2026-02-21T10:05:00Z", status: "resolved", confidence: 45 },
  { id: "FRD-007", shipmentId: "SHP-002", severity: "low", type: "Insurance Anomaly", description: "Cargo value declared for insurance significantly higher than invoice value.", timestamp: "2026-02-16T14:30:00Z", status: "false-positive", confidence: 38 },
  { id: "FRD-008", shipmentId: "SHP-001", severity: "medium", type: "Customs Anomaly", description: "HS code classification may not match declared product description.", timestamp: "2026-02-15T09:50:00Z", status: "resolved", confidence: 65 },
  { id: "FRD-009", shipmentId: "SHP-018", severity: "high", type: "Documentation Fraud", description: "Certificate of origin appears to be altered. Digital signature verification failed.", timestamp: "2026-02-19T07:25:00Z", status: "investigating", confidence: 91 },
  { id: "FRD-010", shipmentId: "SHP-005", severity: "critical", type: "Seal Tampering", description: "Second seal break detected. IoT temperature sensor also shows irregular readings.", timestamp: "2026-02-21T03:40:00Z", status: "active", confidence: 96 },
  { id: "FRD-011", shipmentId: "SHP-014", severity: "low", type: "Weight Anomaly", description: "Container weight 2% above declared. Within tolerance but flagged for monitoring.", timestamp: "2026-02-21T12:00:00Z", status: "resolved", confidence: 32 },
  { id: "FRD-012", shipmentId: "SHP-017", severity: "medium", type: "Route Deviation", description: "Pre-departure scan shows cargo in unauthorized staging area.", timestamp: "2026-02-22T06:10:00Z", status: "active", confidence: 74 },
]

// ==========================================
// WAREHOUSES
// ==========================================
export const warehouses: Warehouse[] = [
  {
    id: "WH-01", name: "Pacific Hub", location: "Mumbai, India", coords: [19.076, 72.8777],
    totalCapacity: 50000, utilized: 42500,
    zones: [
      { name: "Zone A - General", capacity: 20000, utilized: 18500 },
      { name: "Zone B - Cold Storage", capacity: 10000, utilized: 9200 },
      { name: "Zone C - Hazmat", capacity: 5000, utilized: 3800 },
      { name: "Zone D - High Value", capacity: 15000, utilized: 11000 },
    ],
  },
  {
    id: "WH-02", name: "Atlantic Gateway", location: "Delhi, India", coords: [28.7041, 77.1025],
    totalCapacity: 65000, utilized: 48750,
    zones: [
      { name: "Zone A - General", capacity: 30000, utilized: 24000 },
      { name: "Zone B - Cold Storage", capacity: 15000, utilized: 12750 },
      { name: "Zone C - Automotive", capacity: 20000, utilized: 12000 },
    ],
  },
  {
    id: "WH-03", name: "Asia Central", location: "Bangalore, India", coords: [12.9716, 77.5946],
    totalCapacity: 45000, utilized: 40500,
    zones: [
      { name: "Zone A - General", capacity: 15000, utilized: 14500 },
      { name: "Zone B - Electronics", capacity: 15000, utilized: 14000 },
      { name: "Zone C - Perishables", capacity: 15000, utilized: 12000 },
    ],
  },
  {
    id: "WH-04", name: "Middle East Hub", location: "Chennai, India", coords: [13.0827, 80.2707],
    totalCapacity: 35000, utilized: 21000,
    zones: [
      { name: "Zone A - General", capacity: 15000, utilized: 10000 },
      { name: "Zone B - Luxury Goods", capacity: 10000, utilized: 6000 },
      { name: "Zone C - Bulk", capacity: 10000, utilized: 5000 },
    ],
  },
  {
    id: "WH-05", name: "Americas South", location: "Kolkata, India", coords: [22.5726, 88.3639],
    totalCapacity: 28000, utilized: 19600,
    zones: [
      { name: "Zone A - General", capacity: 12000, utilized: 9600 },
      { name: "Zone B - Agricultural", capacity: 10000, utilized: 7000 },
      { name: "Zone C - Industrial", capacity: 6000, utilized: 3000 },
    ],
  },
]

// ==========================================
// INVENTORY ITEMS
// ==========================================
export interface InventoryItem {
  name: string
  sku: string
  currentStock: number
  reorderPoint: number
  stockStatus: "Optimal" | "Low" | "Critical" | "Overstock"
  predictedDemand: number
  leadTimeDays: number
  unitCost: number
}

export const inventoryItems: InventoryItem[] = [
  { name: "Lithium-Ion Battery Packs", sku: "ELC-4021", currentStock: 8500, reorderPoint: 3000, stockStatus: "Optimal", predictedDemand: 4200, leadTimeDays: 14, unitCost: 42.50 },
  { name: "Automotive Brake Assemblies", sku: "AUT-1187", currentStock: 1200, reorderPoint: 2000, stockStatus: "Low", predictedDemand: 3100, leadTimeDays: 21, unitCost: 85.00 },
  { name: "Organic Cotton T-Shirts", sku: "APP-3320", currentStock: 15000, reorderPoint: 5000, stockStatus: "Overstock", predictedDemand: 2800, leadTimeDays: 7, unitCost: 8.25 },
  { name: "Frozen Salmon Fillets (kg)", sku: "FBV-0095", currentStock: 2200, reorderPoint: 1500, stockStatus: "Optimal", predictedDemand: 2200, leadTimeDays: 3, unitCost: 12.80 },
  { name: "Surgical Gloves (boxes)", sku: "MED-7712", currentStock: 450, reorderPoint: 1000, stockStatus: "Critical", predictedDemand: 1500, leadTimeDays: 10, unitCost: 18.00 },
  { name: "OLED Display Panels", sku: "ELC-4055", currentStock: 3400, reorderPoint: 1200, stockStatus: "Optimal", predictedDemand: 2600, leadTimeDays: 18, unitCost: 125.00 },
  { name: "Engine Oil 5W-30 (liters)", sku: "AUT-1204", currentStock: 9800, reorderPoint: 4000, stockStatus: "Optimal", predictedDemand: 5100, leadTimeDays: 5, unitCost: 6.50 },
  { name: "Wireless Earbuds", sku: "ELC-4098", currentStock: 620, reorderPoint: 800, stockStatus: "Low", predictedDemand: 1800, leadTimeDays: 12, unitCost: 22.00 },
  { name: "Stainless Steel Fasteners", sku: "IND-2201", currentStock: 42000, reorderPoint: 10000, stockStatus: "Overstock", predictedDemand: 8000, leadTimeDays: 8, unitCost: 0.45 },
  { name: "Pharmaceutical Tablets (units)", sku: "MED-7730", currentStock: 18000, reorderPoint: 8000, stockStatus: "Optimal", predictedDemand: 12000, leadTimeDays: 15, unitCost: 0.85 },
]

export const inventoryForecast = generateInventoryForecastDataStatic()



export interface WarehouseCapacity {
  id: string
  name: string
  utilization: number
  currentUnits: number
  totalCapacity: number
  zones: number
  staff: number
  efficiency: number
  monthlyThroughput: { month: string; inbound: number; outbound: number }[]
}

export const warehouseCapacity: WarehouseCapacity[] = [
  {
    id: "WC-01", name: "Western Hub - Mumbai", utilization: 85, currentUnits: 42500, totalCapacity: 50000, zones: 4, staff: 120, efficiency: 94,
    monthlyThroughput: [
      { month: "Sep", inbound: 12000, outbound: 11500 },
      { month: "Oct", inbound: 13500, outbound: 12800 },
      { month: "Nov", inbound: 15000, outbound: 14200 },
      { month: "Dec", inbound: 18000, outbound: 16500 },
      { month: "Jan", inbound: 14000, outbound: 13800 },
      { month: "Feb", inbound: 13000, outbound: 12500 },
    ],
  },
  {
    id: "WC-02", name: "Eastern Gateway - Kolkata", utilization: 75, currentUnits: 48750, totalCapacity: 65000, zones: 3, staff: 95, efficiency: 91,
    monthlyThroughput: [
      { month: "Sep", inbound: 10000, outbound: 9800 },
      { month: "Oct", inbound: 11000, outbound: 10500 },
      { month: "Nov", inbound: 12500, outbound: 12000 },
      { month: "Dec", inbound: 14000, outbound: 13200 },
      { month: "Jan", inbound: 11500, outbound: 11200 },
      { month: "Feb", inbound: 10800, outbound: 10500 },
    ],
  },
  {
    id: "WC-03", name: "Southern Central - Bangalore", utilization: 90, currentUnits: 40500, totalCapacity: 45000, zones: 3, staff: 85, efficiency: 96,
    monthlyThroughput: [
      { month: "Sep", inbound: 14000, outbound: 13500 },
      { month: "Oct", inbound: 15500, outbound: 14800 },
      { month: "Nov", inbound: 16000, outbound: 15500 },
      { month: "Dec", inbound: 19000, outbound: 17500 },
      { month: "Jan", inbound: 16500, outbound: 16000 },
      { month: "Feb", inbound: 15000, outbound: 14500 },
    ],
  },
  {
    id: "WC-04", name: "Central Hub - Nagpur", utilization: 60, currentUnits: 21000, totalCapacity: 35000, zones: 3, staff: 65, efficiency: 88,
    monthlyThroughput: [
      { month: "Sep", inbound: 7000, outbound: 6500 },
      { month: "Oct", inbound: 7500, outbound: 7200 },
      { month: "Nov", inbound: 8000, outbound: 7600 },
      { month: "Dec", inbound: 9500, outbound: 9000 },
      { month: "Jan", inbound: 8200, outbound: 8000 },
      { month: "Feb", inbound: 7800, outbound: 7500 },
    ],
  },
]

// ==========================================
// TIME SERIES DATA (Charts)
// ==========================================


// ==========================================
// KPI SUMMARY
// ==========================================
export const kpiData = {
  activeShipments: { value: 14, change: 8, trend: "up" as const },
  onTimeRate: { value: 94.2, change: 1.8, trend: "up" as const },
  totalRevenue: { value: 4850000, change: 12.5, trend: "up" as const },
  riskAlerts: { value: 6, change: -2, trend: "down" as const },
  avgDeliveryTime: { value: 8.3, change: -0.5, trend: "down" as const },
  fraudFlags: { value: 4, change: 1, trend: "up" as const },
  costSavings: { value: 89600, change: 15.2, trend: "up" as const },
  warehouseUtil: { value: 78.4, change: 3.1, trend: "up" as const },
}
