export default defineEventHandler(async (event) => {
  // console.log(event.context.params);

  const { url } = await readBody(event)
  // console.log({url});

  return fetch(url)
})
