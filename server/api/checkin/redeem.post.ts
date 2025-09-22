import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  const userId = user?.id as string
  const { jackpotId } = await readBody(event)

  const { data: jackpot } = await adminClient
    .from('checkin_jackpots')
    .select('*')
    .eq('id', jackpotId)
    .single()

  if (!jackpot)
    return { code: 500, message: 'Jackpot not found' }

  const { makeupPoints } = jackpot

  const { data: assets, error: assetsError } = await adminClient.from('assets')
    .select('pAmount')
    .eq('userId', userId)
    .single()

  if (assetsError) throw assetsError

  if (!assets || assets.pAmount < makeupPoints)
    return { code: 500, message: 'Insufficient points' }

  await updateUserPAmount(adminClient, userId, -makeupPoints, `User redeem makeup card, jackpot id: ${jackpotId}, ${new Date().toISOString()}`)

  const { data: card, error: cardError } = await adminClient.from('checkin_makeup_cards').insert([{
    userId: userId,
    jackpotId: jackpotId,
    status: 0
  }]).select('*').single()

  if (cardError) throw cardError

  return { code: 200, message: 'Redeem successful' }
})
