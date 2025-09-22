import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  const userId = user?.id as string
  const query = getQuery(event);
  const jackpotId = Number(query.jackpotId)

  if (!jackpotId) throw createError({ statusCode: 400, message: 'jackpotId is required' })

  const { data, error } = await adminClient.from('checkin_records')
    .select('date')
    .eq('userId', userId)
    .eq('jackpotId', jackpotId)

  if (error) throw error

  const dates = data.map(item => item.date as string)

  const { data: cards, error: makerupCardError } = await adminClient.from('checkin_makeup_cards')
    .select('*')
    .eq('userId', userId)
    .eq('jackpotId', jackpotId)

  const makerupCardNum = cards?.filter(item => item.status === 0)?.length || 0
  const makerupCardUsed = cards?.filter(item => item.status === 1)?.length || 0

  if (makerupCardError) throw makerupCardError

  const { data: assets, error: assetsError } = await adminClient.from('assets')
    .select('pAmount')
    .eq('userId', userId)
    .single()

  if (assetsError) throw assetsError

  return { code: 200, data: { userId, points: assets?.pAmount || 0, makerupCardNum: makerupCardNum, makerupCardUsed: makerupCardUsed, dates: dates } }
})
