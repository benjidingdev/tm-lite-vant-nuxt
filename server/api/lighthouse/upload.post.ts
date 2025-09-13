import lighthouse from '@lighthouse-web3/sdk'

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)

  const yourText = "PLACE_YOUR_TEXT_HERE"
const apiKey = "PLACE_YOUR_API_KEY_HERE"
const publicKey = "PLACE_YOUR_PUBLIC_KEY_HERE"
const signedMessage = "SIGNATURE/JWT"
const name = "anime"

const response = await lighthouse.textUploadEncrypted(yourText, apiKey, publicKey, signedMessage)
console.log(response)
/* Sample Response
{
  data: {
    Name: 'anime',
    Hash: 'QmTsC1UxihvZYBcrA36DGpikiyR8ShosCcygKojHVdjpGd',
    Size: '67'
  }
}
*/
})
