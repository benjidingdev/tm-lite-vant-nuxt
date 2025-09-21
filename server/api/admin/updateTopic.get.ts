import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'
import all from '#shared/data/topics/all'
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const data = all[id]
  if (!data) {
    throw createError({
      statusCode: 400,
      message: 'topic data source not found'
    })
  }
  const adminClient = serverSupabaseServiceRole(event)
  // update data
  const rz1 = await adminClient.from('topics').select('*').eq('id', id).single()
  if (!rz1.data) {
    return adminClient.from('topics').insert({
      id,
      ...data,
    }).select()
  }
  const { data: { markets } } = rz1
  const marketMapByIdFromJson = _.keyBy(data.markets, 'id')
  markets.forEach((market) => {
    marketMapByIdFromJson[market.id].noNum = market.noNum
    marketMapByIdFromJson[market.id].yesNum = market.yesNum
  })
  data.markets = _.map(marketMapByIdFromJson)
  const rz = await adminClient.from('topics').update({
    ...data,
  }).eq('id', id).select()

  return {
    rz,
    data,
  }
});
