import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = serverSupabaseUser(event);
  const { jackpotId } = await readBody(event)

  const { data: jackpot } = await adminClient
    .from('checkin_jackpots')
    .select('*')
    .eq('id', jackpotId)
    .single()

  if (!jackpot)
    return { code: 500, message: 'Jackpot not found' }
  if (!user || user.points < jackpot.makeupPoints)
    return { code: 500, message: 'Insufficient points' }

  await updateUserPAmount(adminClient, user.id, -jackpot.makeupPoints, `User redeem makeup card, jackpot id: ${jackpot.id}`)

  const { data: card } = await adminClient.from('checkin_makeup_cards').insert([{
    userId: user.id,
    jackpotId: jackpot.id,
    status: 0
  }]).select('*').single()

  return { code: 200, data: card?.id }
})
