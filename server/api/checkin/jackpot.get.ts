import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);

  const { data: jackpot, error: error1 } = await adminClient.from('checkin_jackpots')
    .select('*')
    .order('created', { ascending: false })
    .limit(1)
    .single()

  if (error1) throw error1

  const { data: records, error: error2 } = await adminClient.from('checkin_records')
    .select('userId')
    .eq('jackpotId', jackpot?.id)
  const userCount = new Set(records?.map(c => c.userId)).size

  if (error2) throw error2

  return {
    code: 200,
    data: {
      jackpot,
      userCount
    },
  }
})
