export default defineEventHandler(async () => {
  const { promises: fs } = await import('node:fs')
  const { join } = await import('node:path')
  const DB_PATH = join(process.cwd(), 'app', 'db', 'checkin.json')
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  const db = JSON.parse(raw)

  const cost = db.makeupCardCost || 1200
  if ((db.availablePoints || 0) < cost) {
    return {
      message: 'Insufficient points',
      code: 1,
      data: false,
    }
  }

  db.availablePoints -= cost
  db.makeupCardCount = (db.makeupCardCount || 0) + 1

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
  return {
    message: '',
    code: 0,
    data: true,
  }
})
