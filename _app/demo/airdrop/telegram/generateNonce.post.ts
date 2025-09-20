import { serverSupabaseServiceRole } from "#supabase/server";
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { parseUnits, getAddress, toBytes, keccak256 } from 'viem'
import { domainAirdrop } from '~/config/signTypes'
import * as networkMap from '~/config/networks'
import contractAddressMap from '~/config/contractAddress'
import { validateSiweMessage } from "viem/siwe";
import { createPublicClient, http } from 'viem'

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event)
  const bodyOrigin = await readBody(event)
  const { network, signature, message, messageObj } = _.pick(bodyOrigin, ['network', 'signature', 'message', 'messageObj'])
  const address = getAddress(bodyOrigin.address)
  if(!address) {
    throw createError({
      statusCode: 400,
      message: 'The address is invalid',
      statusMessage: 'InvalidAddress',
    })
  }
  if (!network) {
    throw createError({
      statusCode: 400,
      message: 'The nework is invalid',
      statusMessage: 'InvalidNetwork',
    })
  }
  
  const isMsgValidate = validateSiweMessage({
    address,
    message: messageObj,
  })
  if(!isMsgValidate) {
    throw createError({
      statusCode: 400,
      message: 'The message is invalid',
      statusMessage: 'InvalidMessage',
    })
  }

  const client = createPublicClient({
    chain: networkMap[network],
    transport: http()
  })
  const isSigValidate = await client.verifySiweMessage({
    message,
    signature,
  })
  if(!isSigValidate) {
    throw createError({
      statusCode: 400,
      message: 'The signature is invalid',
      statusMessage: 'InvalidSignature',
    })
  }
  
  const tgBindNonceDB = adminClient.from('tgBindNonce')
  const rz = await tgBindNonceDB.select()
    .eq('address', address)
    .eq('network', network)
    .single()

  if (rz?.data?.status == 'signed') return rz.data
  if (rz?.data?.status =='binded') {
    throw createError({
      statusCode: 400,
      message: `Already binded to telegram ${rz.data?.from?.username}`,
      statusMessage: 'AlreadyBinded',
    })
  }
  if (rz?.data?.status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Already claimed',
      statusMessage: 'AlreadyClaimed',
    })
  }

  if (rz.data) {
    return rz.data
  }

  const { id: chainId } = networkMap[network];
  const domain = {
    ...domainAirdrop,
    chainId,
    verifyingContract: getAddress(contractAddressMap[network].airdrop),
  };
  const dataForSign = {
    to: address,
    reason: 'airdrop:bind-with-telegram',
    tokenAddress: getAddress(contractAddressMap[network].usdtMock),
    amount: parseUnits('50000', 6).toString(),
  }

  const rz3 = await tgBindNonceDB.insert({
    address,
    status: 'pending',
    network,
    domain,
    dataForSign,
  }).select().single()
  
  // create nonce
  if (rz3.status == 201) {
    return rz3.data
  }

  throw createError({
    statusCode: 500,
    message: 'Failed To Create Nonce',
    statusMessage: 'FailedToCreateNonce',
    details: rz3.error?.details,
  })
});
