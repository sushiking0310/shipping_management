import type { InventoryForecast } from "./mock-data"

export function generateInventoryForecastData(): InventoryForecast[] {
  const data: InventoryForecast[] = []
  const baseDate = new Date(2026, 1, 1)
  for (let i = 0; i < 45; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const predicted = Math.floor(1200 + Math.sin(i / 7) * 300 + Math.abs(Math.sin(i)) * 100)
    data.push({
      date: date.toISOString().split("T")[0],
      predicted,
      actual: i < 21 ? Math.floor(predicted + Math.sin(i * 3) * 75) : null,
    })
  }
  return data
}
