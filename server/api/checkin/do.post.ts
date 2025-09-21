import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  const userId = user?.id as string
  const { jackpotId, date, useMakeupCard } = await readBody(event)

  const { data: jackpot } = await adminClient
    .from('checkin_jackpots')
    .select('*')
    .eq('id', jackpotId)
    .single()

  if (!jackpot)
    return { code: 500, message: 'Jackpot not found' }

  const { startDate, endDate, checkinPoints, makeupPoints, totalPoints, returnMultiplier } = jackpot

  if (!date)
    return { code: 500, message: 'Date is required' }

  if (date < startDate || date > endDate)
    return { code: 500, message: `Date not in range ${startDate} -  ${endDate}` }

  const { data: exists } = await adminClient
    .from('checkin_records')
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
      points: checkinPoints,
    }, {
      onConflict: 'userId,jackpotId,date',
    })

    await adminClient.from('checkin_makeup_cards').update({ status: 1, updated: new Date().toISOString() }).eq('id', card.id)

  } else {
    // Normal checkin
    const { data: assets, error: assetsError } = await adminClient.from('assets')
      .select('pAmount')
      .eq('userId', userId)
      .single()

    if (assetsError) throw assetsError

    if (!assets || assets.pAmount < checkinPoints)
      return { code: 500, message: 'Points not enough' }

    await updateUserPAmount(adminClient, userId, -checkinPoints, `User checkin ${date}`)

    await adminClient.from('checkin_records').upsert({
      userId,
      jackpotId,
      date,
      points: checkinPoints,
    }, {
      onConflict: 'userId,jackpotId,date',
    })
  }

  const { count: checkinCount } = await adminClient.from('checkin_records')
    .select('*', { count: 'exact', head: true })
    .eq('jackpotId', jackpotId)
    .eq('userId', userId)

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

  let addPoints = (useMakeupCard ? makeupPoints : checkinPoints) as number

  if (checkinCount === diffDays) {
    const returnPoints = checkinPoints * checkinCount * returnMultiplier
    await updateUserPAmount(adminClient, userId, returnPoints, `User checkin return ${jackpot.id}`)
    // addPoints -= returnPoints
  }

  // Update jackpot total points
  await adminClient.from('checkin_jackpots')
    .update({ totalPoints: totalPoints + addPoints })
    .eq('id', jackpotId)

  return { code: 200, message: useMakeupCard ? 'Makeup checkin successful' : 'Checkin successful' }
})

