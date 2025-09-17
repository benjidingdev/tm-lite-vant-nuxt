import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const bodyOrigin = await readBody(event)
  const { refId, reason } = _.pick(bodyOrigin, ['refId', 'reason'])
  if (!refId) {
    throw createError({
      statusCode: 400,
      message: 'RefId is required',
      statusMessage: 'RefIdRequired',
    })
  }
  if (!reason) {
    throw createError({
      statusCode: 400,
      message: 'Reason is required',
      statusMessage: 'ReasonRequired',
    })
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
    .single()

  if (data) {
    throw createError({
      statusCode: 400,
      message: 'RefId already exists',
      statusMessage: 'RefIdAlreadyExists',
    })
  }

  // insert data into invites table
  const { data: dataInsert } = await adminClient.from('invites').insert({
    refId,
    userId,
    reason,
  }).select().single()

  // update invites table that increase refIdCount by 1
  // get inviter
  const {data: dataInviter} = await adminClient.from('invites')
    .select()
    .eq('userId', refId)
    .single()
  let refCount = dataInviter?.refCount || 0
  refCount++
  // upsert inviter refCount
  const {data: dataInviterUpdate} = await adminClient.from('invites')
    .upsert({ refCount, userId: refId })
    .select()
    .eq('userId', refId)
    .single()

  return {
    dataInsert,
    dataInviterUpdate,
  }
});
