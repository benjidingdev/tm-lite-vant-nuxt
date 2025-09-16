import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { meta } = _.pick(bodyOrigin, ['meta'])
  const { topicsId } = _.pick(bodyOrigin, ['topicsId'])

  const { err }: any = await adminClient.from('markets')
    .update({ meta })
    .eq('topicsId', topicsId)
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
