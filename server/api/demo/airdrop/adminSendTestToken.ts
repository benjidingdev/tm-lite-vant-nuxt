import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, createPublicClient, http, verifyTypedData, formatEther, parseEther, parseUnits } from 'viem'
import { AdminSendTestTokenSign } from '~/config/signTypes'
import * as networkMap from '~/config/networks'
import contractAddressMap from '~/config/contractAddress'
import erc20Abi from '~/config/abis/erc20.json'

const getOpAccount = config => {
  const opPrivateKey = (config.opPrivateKey || '').trim()
  
  if(!/^0x[a-fA-F0-9]{64}$/.test(opPrivateKey)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'InvalidOperatorKey',
      message: `Operator private key(${opPrivateKey.substring(0, 10)}...) is invalid or not configured`
    })
  }
  
  const account = privateKeyToAccount(config.opPrivateKey as `0x${string}`)
  return account
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const bodyOrigin = await readBody(event)

  const { tokenType, userAddress, siweData } = _.pick(bodyOrigin, ['tokenType', 'userAddress', 'siweData'])
  const { network, address } = await validateSiwe(siweData)

  const adminClient = serverSupabaseServiceRole(event)
  const rz = await adminClient.from('sysConfig').select('value').eq('name', 'adminAddressArr').single()
  const adminAddressArr = _.get(rz, 'data.value', [])
  if(!adminAddressArr.includes(address)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid admin address',
      statusMessage: 'InvalidAdminAddress',
    })
  }
  if(network !== 'avaxTest0819') {
    throw createError({
      statusCode: 400,
      message: 'Invalid network',
      statusMessage: 'InvalidNetwork',
    })
  }

  const account = getOpAccount(config)
  const chain = networkMap[network]
  const transport =  http()
  const walletClient = createWalletClient({
    account,
    chain,
    transport,
  })

  let decimals = 6
  if(tokenType === 'turingToken') {
    decimals = 18
  }
  const amount = parseUnits('50000', decimals)
 
  const hash = await walletClient.writeContract({
    address: getValidateAddress(contractAddressMap[network][tokenType]),
    abi: erc20Abi,
    functionName: 'transfer',
    args: [userAddress, amount]
  })

  return {
    hash
  }
});
