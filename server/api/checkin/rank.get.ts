import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const query = getQuery(event);
  const jackpotId = Number(query.jackpotId)

  const { data, error } = await adminClient.from('checkin_user_counts')
    .select('userId, cnt')
    .eq('jackpotId', jackpotId)

  if (error) throw error

  return {
    code: 200,
    data: data,
    message: ''
  }
})
