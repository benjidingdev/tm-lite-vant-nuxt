import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
// import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const body = await readBody(event)
  const { refId, reason } = body

  if (!reason) {
    throw createError({
      statusCode: 400,
      message: 'Reason is required',
      statusMessage: 'ReasonRequired',
    })
  }

  if (!refId) {
    console.log({ body }, 'no refId')
    await updateTopicAuthInviterPAmount(adminClient, userId, body)
    return { success: true }
  }


  // query from user table check if id=refId user exists
  const { data: userData } = await adminClient.from('profiles').select('*')
    .eq('id', refId)
    .single()
  if (!userData) {
    throw createError({
      statusCode: 400,
      message: 'RefId not found',
      statusMessage: 'RefIdNotFound',
    })
  }

  const { data } = await adminClient.from('invites').select('*')
    .eq('userId', userId)
    .eq('reason', reason)
    .single()

  if (data) {
    throw createError({
      statusCode: 400,
      message: 'RefId already exists',
      statusMessage: 'RefIdAlreadyExists',
    })
  }

  // insert data into invites table
  const rz1 = await adminClient.from('invites').upsert({
    refId,
    userId,
    reason,
  }, { onConflict: 'userId,reason' }).select().single()
  console.log('userauth-insert', rz1)

  // update invites table that increase refIdCount by 1
  // get inviter
  const rz2 = await adminClient.from('invites')
    .select()
    .eq('userId', refId)
    .eq('reason', reason)
    .single()
  console.log('invite-refCount', rz2)

  let refCount = rz2.data?.refCount || 0
  refCount++
  // upsert inviter refCount
  const rz3 = await adminClient.from('invites')
    .upsert({ refCount, userId: refId, reason }, { onConflict: 'userId,reason' })
    .select()
    .single()

  console.log('invite-refCount-update', rz3)

  await updateTopicAuthInviterPAmount(adminClient, userId, body)

  return {
    success: true,
  }
});

async function updateTopicAuthInviterPAmount(adminClient: any, userId: string, body: { refId: string, reason: string }) {

  const { refId, reason } = body
  if (!reason.startsWith('wl.topic-')) {
    return
  }

  const topicId = reason.split('-')[1]
  const sharedTopic = topics()
  const topic = sharedTopic.find(t => t.id === Number(topicId))
  if (!topic) {
    return
  }

  const authIncrementAmount = topic.rewards.auth
  await updateUserPAmount(adminClient, userId, authIncrementAmount, reason)

  if (!refId) {
    return
  }

  const inviteIncrementAmount = topic.rewards.invite
  await updateUserPAmount(adminClient, refId, inviteIncrementAmount, reason)
}


async function updateUserPAmount(adminClient: any, userId: string, incrementAmount: number, reason: string) {

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
