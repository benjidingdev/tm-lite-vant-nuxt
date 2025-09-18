import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'
import * as networkMap from '~/config/networks'
import { createPublicClient, http, parseEventLogs } from 'viem'
import airdropAbi from '~/config/abis/airdrop.json'
export default defineEventHandler(async (event) => {

  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { id, hash, reason } = _.pick(bodyOrigin, ['id', 'hash', 'reason'])

  let nonceTable = ''
  let rz = ''
  if (reason === 'airdrop:bind-with-telegram') {
    nonceTable = adminClient.from('tgBindNonce')
    rz = await nonceTable.select()
      .eq('id', id)
      .single()
  } else {
    nonceTable = adminClient.from('nonce')
    const user = await serverSupabaseUser(event)
    const userId = user?.id as string
    rz = await adminClient.from('nonce').select()
      .eq('id', id)
      .eq('userId', userId)
      .single()
  }
  if (rz.status != 200) {
    throw createError({
      statusCode: 400,
      message: 'Item not found',
      statusMessage: 'ItemNotFound',
    })
  }

  const { status, dataForSign } = rz.data
  if (status != 'signed') {
    throw createError({
      statusCode: 400,
      message: 'Item should be signed',
      statusMessage: 'ItemShouldBeSigned',
    })
  }

  // read receipt from chain
  const { network } = rz.data
  const client = createPublicClient({
    chain: networkMap[network],
    transport: http()
  })

  const receipt = await client.getTransactionReceipt({
    hash
  })

  if (receipt.status != 'success') {
    throw createError({
      statusCode: 400,
      statusMessage: 'TxFailed',
    })
  }

  const logs = parseEventLogs({
    abi: airdropAbi,
    eventName: 'TokenDistributed',
    logs: receipt.logs,
  })
  const { args: { claimInput: { nonce } } } = logs[0]
  if (nonce != id) {
    throw createError({
      statusCode: 400,
      message: 'Nonce not match',
      statusMessage: 'NonceNotMatch',
    })
  }

  // update status to successed
  const rz2 = await nonceTable.update({
    status: 'successed',
    hash,
  }).eq('id', id).select().single()
  if (rz2.status != 200) {
    throw createError({
      statusCode: 400,
      message: 'Update failed',
      statusMessage: 'UpdateFailed',
    })
  }

  return rz2.data
});
