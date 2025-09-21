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

  const { count: makerupCardNum, error: makerupCardError } = await adminClient.from('checkin_makeup_cards')
    .select('*', { count: 'exact', head: true })
    .eq('userId', userId)
    .eq('jackpotId', jackpotId)
    .eq('status', 0)


  if (makerupCardError) throw makerupCardError

  const { data: assets, error: assetsError } = await adminClient.from('assets')
    .select('pAmount')
    .eq('userId', userId)
    .single()

  if (assetsError) throw assetsError

  return { code: 0, data: { points: assets.pAmount || 0, makerupCardNum: makerupCardNum, dates: dates } }
})
