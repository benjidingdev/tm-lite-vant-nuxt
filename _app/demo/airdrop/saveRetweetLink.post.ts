import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
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
  const twitterSlug = twitterIdentity?.identity_data?.preferred_username
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const {retweetLink, network, reason} = _.pick(bodyOrigin, ['retweetLink', 'network', 'reason'])
  const allowedReason = ['airdrop:retweet']
  if (!allowedReason.includes(reason)) {
    throw createError({
      statusCode: 400,
      message: 'The reason is invalid',
      statusMessage: 'InvalidReason',
    })
  }
  if(!retweetLink.startsWith(`https://x.com/${twitterSlug}`)){
    throw createError({
      statusCode: 400,
      message: 'The retweet link is invalid',
      statusMessage: 'InvalidRetweetLink',
    })
  }

  const rz = await adminClient.from('retweet').select()
    .eq('network', network)
    .eq('reason', reason)
    .eq('userId', userId)
    .single()
  
  if(rz.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'AlreadySubmitted',
      message: 'You have already submitted your retweet link',
    })
  }

  const rz2 = await adminClient.from('retweet').insert({
    retweetLink, 
    network, 
    reason,
    status: 'pending',
    userId,
  }).select().single()
  
  if(rz2.error) {
    throw createError({
      statusCode: (rz.error.code || 400) as number,
      message:  rz2.error.message || 'Failed to submit retweet link',
      statusMessage: 'FailedToSubmit',
      data: rz2.error,
    })
  }
  return rz2.data
});
