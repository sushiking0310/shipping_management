export function generateRiskTrendData() {
  const data = []
  const baseDate = new Date(2026, 0, 22)
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    data.push({
      date: date.toISOString().split("T")[0],
      avgRisk: Math.floor(20 + Math.abs(Math.sin(i)) * 30),
      highRiskCount: Math.floor(Math.abs(Math.cos(i)) * 5),
    })
  }
  return data
}
