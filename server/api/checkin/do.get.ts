export default defineEventHandler(async () => {
  const { promises: fs } = await import('node:fs')
  const { join } = await import('node:path')
  const DB_PATH = join(process.cwd(), 'app', 'db', 'checkin.json')
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  const db = JSON.parse(raw)

  if (db.isCheckin) {
    return { message: 'Already checked today', code: 1, data: false }
  }

  const days: number[] = Array.isArray(db.checkedDays) ? db.checkedDays : []
  const lastChecked = days.length ? Math.max(...days) : 0
  const next = Math.min(lastChecked + 1, db.totalDays || 30)
  if (!days.includes(next)) days.push(next)
  db.checkedDays = [...new Set(days)].sort((a, b) => a - b)
  db.isCheckin = true

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
  return { message: '', code: 0, data: true }
})
