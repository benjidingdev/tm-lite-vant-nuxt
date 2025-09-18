import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { meta } = _.pick(bodyOrigin, ['meta'])
  const { topicId } = _.pick(bodyOrigin, ['topicId'])

  const { err }: any = await adminClient.from('topics')
    .upsert({ markets })
    .eq('id', topicId)
    .single()
  if (err) {
    throw createError({
      statusCode: 400,
      message: err.message
    })
  }
  return {
    status: 200,
    message: "Market updated successfully"
  };
});
