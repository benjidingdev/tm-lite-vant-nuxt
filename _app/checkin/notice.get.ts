export default defineEventHandler(async () => {
  const { promises: fs } = await import('node:fs')
  const { join } = await import('node:path')
  const DB_PATH = join(process.cwd(), 'app', 'db', 'checkin.json')
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  const db = JSON.parse(raw)
  const noticesList = Array.isArray(db.noticesList) ? db.noticesList : []
  return {
    message: '',
    code: 0,
    data: { noticesList, total: noticesList.length },
  }
})
