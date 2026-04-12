export function generatePricingHistoryData() {
  const data = []
  const baseDate = new Date(2026, 0, 22)
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const baseFuel = 2.5 + Math.sin(i / 5) * 0.3
    data.push({
      date: date.toISOString().split("T")[0],
      avgRate: +(2.2 + Math.sin(i / 7) * 0.5 + Math.abs(Math.cos(i)) * 0.2).toFixed(2),
      fuelIndex: +baseFuel.toFixed(2),
      demandIndex: +(0.6 + Math.sin(i / 4) * 0.25 + Math.abs(Math.sin(i)) * 0.1).toFixed(2),
      capacityUtil: Math.floor(65 + Math.sin(i / 6) * 15 + Math.abs(Math.cos(i)) * 5),
    })
  }
  return data
}
