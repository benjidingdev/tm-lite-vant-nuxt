import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, createPublicClient, http, verifyTypedData, formatEther, parseEther } from 'viem'
import { UserSig } from '~/config/signTypes'
import * as networkMap from '~/config/networks'

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
const handleClaimGas = async (adminClient, { id, userSig, config}) => {
  const rz = await adminClient.from('claimGasNonce').select()
    .eq('id', id)
    .single()
  if (rz?.data?.status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Already claimed',
      statusMessage: 'AlreadyClaimed',
    })
  }

  const { dataForSign, address, domain, network } = rz.data
  if (network !== 'avaxTest0819') {
    throw createError({
      statusCode: 400,
      message: 'Invalid network',
      statusMessage: 'InvalidNetwork',
    })
  }

  const data = {
    address,
    domain,
    types: {
      UserSig,
    },
    primaryType: 'UserSig',
    message: {
      ...dataForSign,
      nonce: id,
    },
    signature: userSig,
  }
  const valid = await verifyTypedData(data)
  if(!valid) {
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
      statusMessage: 'InvalidSignature',
    })
  }

  const account = getOpAccount(config)
  const chain = networkMap[network]
  const transport =  http()
  const publicClient = createPublicClient({
    chain,
    transport
  })
  const walletClient = createWalletClient({
    account,
    chain,
    transport,
  })
  const txData = {
    account,
    to: address,
    value: parseEther(formatEther(dataForSign.amount))
  }
  const hash = await walletClient.sendTransaction(txData)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  if (receipt.status =='success') {
    await adminClient.from('claimGasNonce').update({
      status: 'successed',
      hash,
      userSig,
    }).eq('id', id)
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const adminClient = serverSupabaseServiceRole(event)
  const bodyOrigin = await readBody(event)
  const {id, userSig, reason} = _.pick(bodyOrigin, ['id', 'userSig', 'reason'])

  let nonceTable = ''
  let rz = ''
  if (reason === 'airdrop:claim-gas') {
    return handleClaimGas(adminClient, {id, userSig, config})
  } else if(reason === 'airdrop:bind-with-telegram') {
    nonceTable = adminClient.from('tgBindNonce')
    rz = await nonceTable.select()
      .eq('id', id)
      .single()
  }else{
    nonceTable = adminClient.from('nonce')
    const user = await serverSupabaseUser(event)
    const userId = user?.id as string
    rz = await nonceTable.select()
      .eq('id', id)
      .eq('userId', userId)
      .single()
  }
  
  if(rz.status != 200) {
    throw createError({
      statusCode: 400,
      message: 'Item not found',
      statusMessage: 'ItemNotFound',
    })
  }

  const { dataForSign, address, domain, status } = rz.data
  if(status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Item already claimed',
      statusMessage: 'ItemClaimed',
    })
  }
  if(status == 'signed') {
    return rz.data
  }
  
  // compare dataForSign with userSig
  const data = {
    address,
    domain,
    types: {
      UserSig,
    },
    primaryType: 'UserSig',
    message: {
      ...dataForSign,
      nonce: id,
    },
    signature: userSig,
  }
  const valid = await verifyTypedData(data)
  if(!valid) {
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
      statusMessage: 'InvalidSignature',
    })
  }

  const account = getOpAccount(config)
  const opSig = await account.signTypedData({
    domain,
    types: {
      OperatorSig: UserSig,
    },
    primaryType: 'OperatorSig',
    message: {
     ...dataForSign,
      nonce: id,
    },
  })

  // update userSig and opSig into database
  const rz2 = await nonceTable.update({
    userSig,
    opSig,
    status: 'signed',
  }).eq('id', id).select().single()
  if(rz2.status!= 200) {
    throw createError({
      statusCode: 400,
      message: 'Update failed',
      statusMessage: 'UpdateFailed',
    })
  }

  return rz2.data
});
