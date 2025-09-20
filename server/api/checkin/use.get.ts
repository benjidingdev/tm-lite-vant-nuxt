import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { promises: fs } = await import('node:fs')
  const { join } = await import('node:path')
  const DB_PATH = join(process.cwd(), 'app', 'db', 'checkin.json')

  const q = getQuery(event)
  const day = Number(q?.day ?? 0)

  const raw = await fs.readFile(DB_PATH, 'utf-8')
  const db = JSON.parse(raw)

  if (!Number.isFinite(day) || day <= 0 || day > (db.totalDays || 30)) {
    return { message: 'Invalid day', code: 1, data: false }
  }
  if ((db.makeupCardCount || 0) <= 0) {
    return { message: 'No makeup card', code: 1, data: false }
  }

  db.makeupCardCount -= 1
  const days: number[] = Array.isArray(db.checkedDays) ? db.checkedDays : []
  if (!days.includes(day)) days.push(day)
  db.checkedDays = [...new Set(days)].sort((a, b) => a - b)

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
  return { message: '', code: 0, data: true }
})
