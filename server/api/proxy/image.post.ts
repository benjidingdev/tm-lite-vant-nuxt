export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)

  try {

    return $fetch(url, {
      responseType: 'arraybuffer',
    }).then(res => {
      return Buffer.from(res as ArrayBuffer).toString('base64')
    }).catch(err => {
      console.log('error', err)
      return ''
    })
  } catch (error) {
    console.log('error', error)
    return ''
  }
})
