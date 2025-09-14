import lighthouse from '@lighthouse-web3/sdk'

export default defineEventHandler(async (event) => {
  const { title, description, address } = await readBody(event)
  const { lighthouseStorageApiKey } = useRuntimeConfig(event)

  const data = {
    title,
    description,
    address
  }
  const content = JSON.stringify(data)

  const response = await lighthouse.uploadText(content, lighthouseStorageApiKey)
  return {
    hash: response.data.Hash
  }
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
