import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const bodyOrigin = await readBody(event)
  const { refId } = _.pick(bodyOrigin, ['refId'])
  if (!refId) {
    throw createError({
      statusCode: 400,
      message: 'RefId is required',
      statusMessage: 'RefIdRequired',
    })
  }
  // query from user table check if id=refId user exists
  const {data: userData} = await adminClient.from('profiles').select('*')
    .eq('id', refId)
    .single()
  if (!userData) {
    throw createError({
      statusCode: 400,
      message: 'RefId not found',
      statusMessage: 'RefIdNotFound',
    })
  }

  const {data} = await adminClient.from('invites').select('*')
    .eq('userId', userId)
    .single()

  if (data?.refId) {
    throw createError({
      statusCode: 400,
      message: 'RefId already exists',
      statusMessage: 'RefIdAlreadyExists',
    })
  }

  // insert data into invites table
  const {data: userXData} = await adminClient.from('x_profiles').select('*')
  .eq('id', userId)
  .single()
  const meta = {
    xAvatar: userXData?.avatar_url,
    xName: userXData?.full_name,
    xSlug: userXData?.user_name,
  }
  const {data: dataInsert} = await adminClient.from('invites').insert({
    refId,
    userId,
    meta,
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
    .single()
  return {
    dataInsert,
    dataInviterUpdate,
  }
});
