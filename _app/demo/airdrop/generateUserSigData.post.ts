import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'
import { parseUnits, getAddress, parseEther, toBytes, keccak256 } from 'viem'
import { domainAirdrop } from '~/config/signTypes'
import * as networkMap from '~/config/networks'
import contractAddressMap from '~/config/contractAddress'

const handleBindWithTelegram = async (adminClient, {address, network}) => {
  const rz = await adminClient.from('tgBindNonce').select()
    .eq('address', address)
    .eq('network', network)
    .single()
  if (rz?.data?.status == 'signed') return rz.data
  if (rz?.data?.status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Already claimed',
      statusMessage: 'AlreadyClaimed',
    })
  }
  if(rz?.data?.status != 'binded') {
    throw createError({
      statusCode: 400,
      message: 'Must bind with telegram first',
      statusMessage: 'StatusShouldBeBinded',
    })
  }

  return rz.data
}

const handleBindWithClaimGas = async (adminClient, {address, network, reason}) => {
  const rzTgBind = await adminClient.from('tgBindNonce').select()
    .eq('address', address)
    .eq('network', network)
    .single()
  if (rzTgBind?.data?.status != 'binded') {
    throw createError({
      statusCode: 400,
      message: 'Must bind with telegram first',
      statusMessage: 'StatusShouldBeBinded',
    })
  }
  const rz = await adminClient.from('claimGasNonce').select()
    .eq('address', address)
    .eq('network', network)
    .single()
  if (rz?.data?.status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Already claimed',
      statusMessage: 'AlreadyClaimed',
    })
  }

  const dataForSign = {
    to: address,
    reason,
  }

  dataForSign.tokenAddress = _.padEnd('0x', 42, '0')
  dataForSign.amount = parseEther('0.01').toString()
  dataForSign.data = `${reason}:${rzTgBind.data.from.id}`

  const { id: chainId } = networkMap[network];
  const domain = {
    ...domainAirdrop,
    chainId,
    verifyingContract: getAddress(contractAddressMap[network].airdrop),
  };
  if (rz.data) {
    const rz2 = await adminClient.from('claimGasNonce').update({
      domain,
      dataForSign,
      status: 'pending',
    }).eq('id', rz.data.id).select().single()

    if (rz2.status == 200) {
      return rz2.data
    }
    throw createError({
      statusCode: 500,
      message: 'Failed To Update Nonce',
      statusMessage: 'FailedToUpdateNonce',
    })
  }

  const rz3 = await adminClient.from('claimGasNonce').insert({
    domain,
    address,
    status: 'pending',
    network,
    dataForSign,
  }).select().single()

  if (rz3.status == 201) {
    return rz3.data
  }

  throw createError({
    statusCode: 500,
    message: 'Failed To Create Nonce',
    statusMessage: 'FailedToCreateNonce',
  })
}

export default defineEventHandler(async (event) => {
  const bodyOrigin = await readBody(event)
  const { reason, network } = _.pick(bodyOrigin, ['reason', 'network'])
  const address = getAddress(bodyOrigin.address)
  if (!network) {
    throw createError({
      statusCode: 400,
      message: 'The nework is invalid',
      statusMessage: 'InvalidNetwork',
    })
  }
  const allowedReason = ['airdrop:bind-with-x', 'airdrop:retweet',  'airdrop:claim-gas', 'airdrop:bind-with-telegram']
  if (!allowedReason.includes(reason)) {
    throw createError({
      statusCode: 400,
      message: 'The reason is invalid',
      statusMessage: 'InvalidReason',
    })
  }
  const adminClient = serverSupabaseServiceRole(event)
  if (reason == 'airdrop:bind-with-telegram') {
    return handleBindWithTelegram(adminClient, {address, network})
  }
  if (reason == 'airdrop:claim-gas') {
    return handleBindWithClaimGas(adminClient, {address, network, reason})
  }

  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const twitterIdentity = user?.identities?.find(identity => identity.provider === 'twitter')
  const hasTwitterAuth = !!twitterIdentity
  if (!hasTwitterAuth) {
    throw createError({
      statusCode: 400,
      message: 'Must auth with twitter first',
      statusMessage: 'MustAuthWithX',
    })
  }

  const rz = await adminClient.from('nonce').select()
    .eq('address', address)
    .eq('network', network)
    .eq('reason', reason)
    .eq('userId', userId)
    .single()

  if (rz?.data?.status == 'signed') return rz.data
  if (rz?.data?.status == 'successed') {
    throw createError({
      statusCode: 400,
      message: 'Already claimed',
      statusMessage: 'AlreadyClaimed',
    })
  }

  const rzRetweet = await adminClient.from('retweet').select()
    .eq('network', network)
    .eq('reason', reason)
    .eq('userId', userId)
    .single()
      
  const dataForSign = {
    to: address,
    reason,
  }
  switch(reason) {
    case 'airdrop:bind-with-x':
      dataForSign.tokenAddress = getAddress(contractAddressMap[network].usdtMock)
      dataForSign.amount = parseUnits('50000', 6).toString()
      dataForSign.data = `${reason}:${twitterIdentity.id}`
      break
    case 'airdrop:retweet':
      dataForSign.tokenAddress = getAddress(contractAddressMap[network].turingToken)
      dataForSign.amount = parseUnits('1000', 18).toString()
      dataForSign.data = `${reason}:${twitterIdentity.id}:${rzRetweet.data.retweetLink}`
      break
  }

  const { id: chainId } = networkMap[network];
  const domain = {
    ...domainAirdrop,
    chainId,
    verifyingContract: getAddress(contractAddressMap[network].airdrop),
  };
  if (rz.data) {
    const rz2 = await adminClient.from('nonce').update({
      domain,
      dataForSign,
    }).eq('id', rz.data.id).select().single()

    if (rz2.status == 200) {
      return rz2.data
    }
    throw createError({
      statusCode: 500,
      message: 'Failed To Update Nonce',
      statusMessage: 'FailedToUpdateNonce',
    })
  }

  // create nonce
  if (reason == 'airdrop:retweet') {
    if (rzRetweet.status != 200) {
      throw createError({
        statusCode: 400,
        message: 'You have not retweeted yet',
        statusMessage: 'NotRetweeted',
      })
    }
  }
  const rz3 = await adminClient.from('nonce').insert({
    domain,
    reason,
    address,
    status: 'pending',
    userId,
    network,
    dataForSign,
    twitterInfo: {
      sub: _.get(twitterIdentity, 'identity_data.sub'),
      slug: _.get(twitterIdentity, 'identity_data.user_name'),
      name: _.get(twitterIdentity, 'identity_data.full_name'),
      avatar: _.get(twitterIdentity, 'identity_data.avatar_url'),
    }
  }).select().single()

  if (rz3.status == 201) {
    return rz3.data
  }

  throw createError({
    statusCode: 500,
    message: 'Failed To Create Nonce',
    statusMessage: 'FailedToCreateNonce',
  })
});
