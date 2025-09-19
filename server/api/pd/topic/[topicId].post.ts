import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
// import { useSharedTopic } from ""

export default defineEventHandler(async (event) => {

  const sharedTopic = topics()
  const topicId = getRouterParam(event, 'topicId')
  const topic = sharedTopic.find(t => t.id === Number(topicId))
  if (!topic) {
    throw createError({
      statusCode: 400,
      message: 'Topic not found',
      statusMessage: 'TopicNotFound',
    })
  }

  const adminClient = serverSupabaseServiceRole(event)
  const body = await readBody(event)
  // console.log({ topicId, userId, body, topic })
  const reason = 'retweet_topic_' + topicId

  const { action } = body
  if (!action) {
    throw createError({
      statusCode: 400,
      message: 'action is required',
      statusMessage: 'ActionRequired',
    })
  }

  if (action === 'topic-join_list') {
    // const { data, error } = await adminClient.from('retweets').select('*, x_profiles (*), assets (*)').eq('reason', reason)
    let { data, error } = await adminClient.from('retweets').select('*, x_profiles (*)').eq('reason', reason)
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
        statusMessage: 'ListTopicError',
      })
    }

    const userIds = data?.map(i => i.userId)
    console.log('topic-join_list', { userIds })
    if (!userIds?.length) {
      return { data: { success: true, data: [] } }
    }

    const rz = await adminClient.from('assets').select('*').in('userId', userIds)
    console.log(rz)
    data = data?.map(i => ({ ...i, pAmount: rz?.data?.find(j => j.userId === i.userId)?.pAmount || 0 })) || []
    // console.log(data, error, reason)
    return { data: { success: true, data } }
  }


  // other action need user login
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

  if (action === 'topic-join') {
    const { retweetLink } = body

    if (!retweetLink) {
      throw createError({
        statusCode: 400,
        message: 'RetweetLink is required',
        statusMessage: 'RetweetLinkRequired',
      })
    }

    const twitterSlug = twitterIdentity?.identity_data?.preferred_username

    if (!retweetLink.startsWith(`https://x.com/${twitterSlug}`)) {
      throw createError({
        statusCode: 400,
        message: 'The retweet link is invalid',
        statusMessage: 'InvalidRetweetLink',
      })
    }

    {
      const { count } = await adminClient.from('retweets').select('*', { count: 'exact', head: true }).eq('url', retweetLink);
      if (count && count > 0) {
        throw createError({
          statusCode: 400,
          message: 'Url already joined',
          statusMessage: 'JoinTopicFailed',
        })
      }
    }

    const { data, error } = await adminClient.from('retweets').upsert({
      userId,
      url: retweetLink,
      reason,
    }, {
      onConflict: 'userId,reason',
      // ignoreDuplicates: true,
    }).select().single()
    // console.log(data, error, 'xxx join topic')

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
        statusMessage: 'JoinTopicError',
      })
    }

    if (!data) {
      throw createError({
        statusCode: 400,
        message: 'You have already joined this topic',
        statusMessage: 'JoinTopicFailed',
      })
    }

    const incrementAmount = topic?.rewards?.retweet || 0;
    await updateUserPAmount(adminClient, userId, incrementAmount, reason)

    return {
      data: { success: true }
    }
  }

  if (action === 'topic-join_check') {
    const { count } = await adminClient.from('retweets').select('*', { count: 'exact', head: true }).eq('reason', reason).eq('userId', userId);
    // console.log({ count, reason, userId })
    return { data: { success: !!(count && count > 0) } }
  }

  if (action === 'topic-join_del') {
    const { data, error } = await adminClient.from('retweets').delete().eq('reason', reason).eq('userId', userId)
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
        statusMessage: 'DelTopicError',
      })
    }
    // console.log(data, error)
    return { data: { success: true } }
  }

  return { data: { success: true } }
});


async function updateUserPAmount(adminClient: any, userId: string, incrementAmount: number, reason: string) {

  const rz = await adminClient.from('assets')
    .select()
    .eq('userId', userId)
    .single()

  console.log('asset-pAmount', userId, rz)

  let pAmount = rz.data?.pAmount || 0
  pAmount += incrementAmount;

  console.log({ pAmount })
  // upsert inviter pAmount
  const rz1 = await adminClient.from('assets')
    .upsert({ pAmount, userId }, { onConflict: 'userId' })
    .select()
    .single()

  console.log('asset-pAmount-update', userId, rz1)

  const rz2 = await adminClient.from('assetsLog').insert({
    userId,
    delta: incrementAmount,
    reason,
  })

  console.log('rz2', rz2)
}
