import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
// import { useSharedTopic } from ""

export default defineEventHandler(async (event) => {

  const adminClient = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  const topicId = getRouterParam(event, 'topicId')
  if (!topicId) {
    throw createError({
      statusCode: 400,
      message: 'Topic id is required',
      statusMessage: 'TopicIdRequired',
    })
  }

  const { data: topic, error } = await adminClient.from('topics').select('*').eq('id', topicId).single()
  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
      statusMessage: 'GetTopicError',
    })
  }

  // const sharedTopic = topics()
  // const topic = sharedTopic.find(t => t.id === Number(topicId))

  // console.log('topic', topic)
  const reason = 'retweet_topic_' + topicId

  const { action } = body
  if (!action) {
    throw createError({
      statusCode: 400,
      message: 'action is required',
      statusMessage: 'ActionRequired',
    })
  }

  if (action === 'topic-get') {
    return { data: { success: true, topic } }
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

    const incrementAmount = topic?.meta?.rewards?.retweet || 0;
    await updateUserPAmount(adminClient, userId, incrementAmount, reason)

    return {
      data: { success: true }
    }
  }

  if (action === 'topic-join_check') {
    const { count } = await adminClient.from('retweets').select('*', { count: 'exact', head: true }).eq('reason', reason).eq('userId', userId);
    // console.log({ count, reason, userId })
    return { data: { success: !!(count && count > 0), topic } }
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

  if (action === 'topic-market-trade') {
    // console.log('topic-market-trade', body)
    const { marketId, isYes = false } = body
    if (!marketId) {
      throw createError({
        statusCode: 400,
        message: 'marketId is required',
        statusMessage: 'MarketIdRequired',
      })
    }

    {
      const rz = await adminClient.from('userMarkets').select('*').eq('userId', userId).single()
      // console.log('user market data', rz)
      const tradeMarkets = [...rz.data?.yesMarkets || [], ...rz.data?.noMarkets || []]
      console.log('xxx', tradeMarkets, marketId, tradeMarkets.includes(marketId))
      if (tradeMarkets.includes(marketId)) {
        throw createError({
          statusCode: 400,
          message: 'You have already traded this market',
          statusMessage: 'TradeMarketFailed',
        })
      }
    }

    const market = topic?.markets?.find(i => i.id == marketId)
    if (!market) {
      throw createError({
        statusCode: 400,
        message: 'Market not found',
        statusMessage: 'MarketNotFound',
      })
    }

    // console.log('topic-market-trade', market)
    if (isYes) {
      market.yesNum = (market.yesNum || 0) + 1
    } else {
      market.noNum = (market.noNum || 0) + 1
    }

    const { data: _marketData, error: marketError } = await adminClient.from('userMarkets').select('*').eq('userId', userId).single()
    const marketData: any = _marketData || {};
    let col = isYes ? 'yesMarkets' : 'noMarkets'
    marketData[col] = marketData[col] || []
    marketData[col].push(marketId)

    const rz = await adminClient.from('userMarkets').upsert({
      [col]: marketData[col],
      userId
    }, { onConflict: 'userId' })

    // console.log(rz, 'xxx trade market')

    if (rz.error) {
      throw createError({
        statusCode: 400,
        message: rz.error.message,
        statusMessage: 'TradeMarketError',
      })
    }

    // console.log('topic-market-trade', marketData)
    // console.log('topic-market-trade', topic?.markets, markets, market)
    const rz2 = await adminClient.from('topics').update({ markets: topic?.markets || [] }).eq('id', topicId)
    if (rz2.error) {
      throw createError({
        statusCode: 400,
        message: rz2.error.message,
        statusMessage: 'UpdateMarketError',
      })
    }

    // console.log(rz2, 'xxx update topic market')

    await updateUserPAmount(adminClient, userId, market?.meta?.market?.trade || 200, `trade market ${marketId} ${isYes ? 'yes' : 'no'}`)
    return { status: 200, msg: "trade successfully!" }
  }


  if (action === 'topic-market-claim') {
    // get userid
    // usermarkets claimedTopicIds
    // topics meta claimedMarketId
    // assets +200

    const userMarketsrz = await adminClient.from('userMarkets').select('*').eq('userId', userId).single()
    const claimedTopicIds = userMarketsrz.data.claimedTopicIds || [];
    if (claimedTopicIds?.some(item => item == topicId)) {
      throw createError({
        statusCode: 400,
        message: 'You have already claimed this topic',
        statusMessage: 'ClaimTopicFailed',
      })
    }

    const topicsrz = await adminClient.from('topics').select('*').eq('id', topicId).single()
    if (topicsrz.error || !topicsrz.data) {
      throw createError({
        statusCode: 400,
        message: topicsrz.error?.message || 'Topic not found',
        statusMessage: 'TopicNotFound',
      })
    }
    const userSelectedYesMarket = userMarketsrz?.data?.yesMarkets || [];
    const correctId = topicsrz?.data?.meta?.claimedMarketId;
    // console.log('xxx userSelectedYesMarket', userSelectedYesMarket, correctId)
    if (!userSelectedYesMarket.some((marketId: any) => correctId == marketId)) {
      return { status: 200, msg: "You select wrong answer, couldn't get reward" }
    }

    const updateUMrz = await adminClient.from('userMarkets').upsert({
      claimedTopicIds: [...new Set([...claimedTopicIds, Number(topicId)])],
      userId
    }, { onConflict: 'userId' })

    // console.log(rz, 'xxx trade market')

    if (updateUMrz.error) {
      throw createError({
        statusCode: 400,
        message: updateUMrz.error.message,
        statusMessage: 'update user market',
      })
    }
    // console.log('xxxclaim topic success', topicsrz?.data?.meta?.rewards?.trade)
    await updateUserPAmount(adminClient, userId, topicsrz?.data?.meta?.rewards?.trade, `market claimed ${topicId} `)
    return { status: 200, msg: "claim got!" }

  }

  return { data: { success: true } }
});
