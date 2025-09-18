import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string

  const bodyOrigin = await readBody(event)
  const { title } = _.pick(bodyOrigin, ['title'])
  const adminClient = serverSupabaseServiceRole(event)

  const { data, error } = await adminClient.from('topics')
    .upsert({ title, userId })
    .select()
    .eq('userId', userId)
    .single()

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return {
    res: 200,
    data,
  }
});
