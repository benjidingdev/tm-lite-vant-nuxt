export async function updateUserPAmount(adminClient: any, userId: string, incrementAmount: number, reason: string) {

  {
    const { count } = await adminClient.from('assetsLog').select('*', { count: 'exact', head: true }).eq('userId', userId).eq('reason', reason);
    if (count && count > 0) {
      throw createError({
        statusCode: 400,
        message: 'You have already updated pAmount',
        statusMessage: 'UpdatePAmountFailed',
      })
    }
  }

  const rz2 = await adminClient.from('assetsLog').insert({
    userId,
    delta: incrementAmount,
    reason,
  })

  console.log('userauth-pAmount-log', rz2)

  if (rz2.error) {
    console.log('userauth-pAmount-log-error', rz2.error)
    throw createError({
      statusCode: 400,
      message: 'Failed to update pAmount log',
      statusMessage: 'FailedToUpdatePAmountLog',
    })
  }


  const rz = await adminClient.from('assets')
    .select()
    .eq('userId', userId)
    .single()

  console.log('userauth-pAmount', userId, rz)

  let pAmount = rz.data?.pAmount || 0
  pAmount += incrementAmount;

  console.log({ pAmount })
  // upsert inviter pAmount
  const rz1 = await adminClient.from('assets')
    .upsert({ pAmount, userId }, { onConflict: 'userId' })
    .select()
    .single()

  console.log('userauth-pAmount-update', rz1)
}
