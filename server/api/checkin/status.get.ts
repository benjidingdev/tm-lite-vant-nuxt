export default defineEventHandler(async () => {
  const { promises: fs } = await import('node:fs')
  const { join } = await import('node:path')
  const DB_PATH = join(process.cwd(), 'app', 'db', 'checkin.json')
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  const db = JSON.parse(raw)

  const days: number[] = Array.isArray(db.checkedDays) ? db.checkedDays : []
  const sorted = [...new Set(days)].sort((a, b) => a - b)

  let consecutiveDays = 0
  if (sorted.length) {
    consecutiveDays = 1
    for (let i = sorted.length - 1; i > 0; i--) {
      if (sorted[i] - sorted[i - 1] === 1) consecutiveDays++
      else break
    }
  }

  const lastChecked = sorted.length ? Math.max(...sorted) : 0
  const nextDay = Math.min(lastChecked + 1, db.totalDays || 30)
  const currentDay = db.isCheckin ? lastChecked : nextDay

  return {
    message: '',
    code: 0,
    data: {
      totalDays: db.totalDays,
      checkedDays: sorted,
      consecutiveDays,
      isCheckin: !!db.isCheckin,
      availablePoints: db.availablePoints || 0,
      makeupCardCount: db.makeupCardCount || 0,
      makeupCardCost: db.makeupCardCost || 1200,
      currentDay,
    },
  }
})
