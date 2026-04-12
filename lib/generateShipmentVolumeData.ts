export function generateShipmentVolumeData() {
  const data = []
  const baseDate = new Date(2026, 0, 22)
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    data.push({
      date: date.toISOString().split("T")[0],
      shipments: Math.floor(45 + Math.abs(Math.sin(i)) * 35),
      delivered: Math.floor(30 + Math.abs(Math.cos(i)) * 25),
      delayed: Math.floor(2 + Math.abs(Math.sin(i * 2)) * 8),
    })
  }
  return data
}
