import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
// import { useSharedTopic } from ""

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

  const body = await readBody(event)
  console.log({ topicId, userId, body, topic })
  const reason = 'retweet_topic_' + topicId

  const { retweetLink, action } = body
  if (!action) {
    throw createError({
      statusCode: 400,
      message: 'action is required',
      statusMessage: 'ActionRequired',
    })
  }

  if (action === 'join-topic') {
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
      const { data } = await serverSupabaseServiceRole(event).from('retweets').select().eq('reason', reason).eq('userId', userId).single()
      if (data) {
        throw createError({
          statusCode: 400,
          message: 'You have already joined this topic',
          statusMessage: 'TopicAlreadyJoined',
        })
      }
    }

    const { data, error } = await serverSupabaseServiceRole(event).from('retweets').insert({
      userId,
      url: retweetLink,
      reason,
    })
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
        statusMessage: 'JoinTopicError',
      })
    }
    return {
      data: { success: true }
    }
  }

  if (action === 'check-topic') {
    const { data } = await serverSupabaseServiceRole(event).from('retweets').select().eq('reason', reason).eq('userId', userId).single()

    return { data: { success: data ? true : false } }
  }

  if (action === 'del-topic') {
    const { data, error } = await serverSupabaseServiceRole(event).from('retweets').delete().eq('reason', reason).eq('userId', userId)
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
        statusMessage: 'DelTopicError',
      })
    }
    console.log(data, error)
    return { data: { success: true } }
  }

  return { data: { success: true } }
});
