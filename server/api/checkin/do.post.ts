import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = serverSupabaseUser(event);
  const userId = user?.id
  const { jackpotId, date, useMakeupCard } = await readBody(event)

  const { data: jackpot } = await adminClient
    .from('checkin_jackpots')
    .select('*')
    .eq('id', jackpotId)
    .single()

  if (!jackpot)
    return { code: 500, message: 'Jackpot not found' }
  if (date < jackpot.startDate || date > jackpot.endDate)
    return { code: 500, message: `Date not in range ${jackpot.startDate} -  ${jackpot.endDate}` }

  const { data: exists } = await adminClient
    .from('checkins')
    .select('*')
    .eq('userId', userId)
    .eq('jackpotId', jackpotId)
    .eq('date', date)

  if (exists?.length)
    return { code: 500, message: 'This date already checked in' }

  if (useMakeupCard) {
    // Makeup card checkin
    const { data: card } = await adminClient
      .from('checkin_makeup_cards')
      .select('*')
      .eq('userId', userId)
      .eq('status', 0)
      .limit(1)
      .single()

    if (!card) return { code: 500, message: 'You don\'t have any makeup card' }

    await adminClient.from('checkin_records').upsert({
      userId,
      jackpotId,
      date,
      points: jackpot.checkinPoints,
    }, {
      onConflict: 'userId,jackpotId,date',
    })

    await adminClient.from('checkin_makeup_cards').update({ status: 1, updated: new Date().toISOString() }).eq('id', card.id)

  } else {
    // Normal checkin
    if (!user || user.pAmount < jackpot.checkinPoints)
      return { code: 500, message: 'Points not enough' }

    await updateUserPAmount(adminClient, userId, -jackpot.checkinPoints, `User checkin ${date}`)

    await adminClient.from('checkin_records').upsert({
      userId,
      jackpotId,
      date,
      points: jackpot.checkinPoints,
    }, {
      onConflict: 'userId,jackpotId,date',
    })
  }

  // Update jackpot total points
  await adminClient.from('checkin_jackpots')
    .update({ totalPoints: jackpot.totalPoints + jackpot.checkinPoints })
    .eq('id', jackpotId)

  return { code: 200, message: useMakeupCard ? 'Makeup checkin successful' : 'Checkin successful' }
})

