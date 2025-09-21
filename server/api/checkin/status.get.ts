import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = serverSupabaseUser(event);
  const query = getQuery(event);
  const jackpotId = Number(query.jackpotId)

  if (!jackpotId) throw createError({ statusCode: 400, message: 'jackpotId is required' })

  const { data, error } = await adminClient.from('checkin_records')
    .select('date')
    .eq('userId', user?.id)
    .eq('jackpotId', jackpotId)

  if (error) throw error

  const { data: makerupCardNum, error: makerupCardError } = await adminClient.from('checkin_makeup_cards')
    .select('*', { count: 'exact', head: true })
    .eq('userId', user?.id)

  if (makerupCardError) throw makerupCardError

  return { code: 0, data: { points: user.pAmount || 0, makerupCardNum: makerupCardNum || 0, dates: data } }
})
