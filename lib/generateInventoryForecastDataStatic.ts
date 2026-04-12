export function generateInventoryForecastDataStatic() {
  const data: { date: string; predicted: number; actual: number | null; safety: number }[] = []
  for (let i = 0; i < 45; i++) {
    const dateStr = `Day ${i + 1}`
    const base = 1200 + Math.round(Math.sin(i / 7) * 300)
    const predicted = base + (i % 3 === 0 ? 50 : -30)
    data.push({
      date: dateStr,
      predicted,
      actual: i < 21 ? predicted + (i % 2 === 0 ? 60 : -45) : null,
      safety: 800,
    })
  }
  return data
}
