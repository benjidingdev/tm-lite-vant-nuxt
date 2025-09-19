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

  if (!reason.startsWith('wl.topic-')) {
    throw createError({
      statusCode: 400,
      message: 'Reason is not topic reason',
      statusMessage: 'ReasonNotTopicReason',
    })
  }

  const topicId = reason.split('-')[1]
  const { data: topic, error } = await adminClient.from('topics').select('*').eq('id', topicId).single()
  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
      statusMessage: 'GetTopicError',
    })
  }

  if (!refId) {
    console.log({ body }, 'no refId')
    await updateTopicAuthInviterPAmount(adminClient, userId, body, topic)
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
  // get inviter wl.topic-1
  const rz2 = await adminClient.from('invites')
    .select()
    .eq('userId', refId)
    .eq('reason', reason)
    .single()
  console.log('invite-refCount', rz2)

  let refCount = rz2?.data?.refCount || 0
  refCount++
  // upsert inviter refCount
  const rz3 = await adminClient.from('invites')
    .upsert({ refCount, userId: refId, reason }, { onConflict: 'userId,reason' })
    .select()
    .single()

  console.log('invite-refCount-update', rz3)

  await updateTopicAuthInviterPAmount(adminClient, userId, body, topic)

  return {
    success: true,
  }
});

async function updateTopicAuthInviterPAmount(adminClient: any, userId: string, body: { refId: string, reason: string }, topic: any) {

  const { refId, reason } = body

  const authIncrementAmount = topic.meta?.rewards?.auth || 0
  await updateUserPAmount(adminClient, userId, authIncrementAmount, reason)

  if (!refId) {
    return
  }

  const inviteIncrementAmount = topic.meta?.rewards?.invite || 0
  await updateUserPAmount(adminClient, refId, inviteIncrementAmount, `${reason}_invite_${userId}`)
}
