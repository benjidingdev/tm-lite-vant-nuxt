export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  return fetch(url)
})
