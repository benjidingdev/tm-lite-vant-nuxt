import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { markets } = _.pick(bodyOrigin, ['markets'])
  const { topicId } = _.pick(bodyOrigin, ['topicId'])

  console.log('update topicId, markets', topicId, markets)
  const rz = await adminClient.from('topics')
    .update({ markets })
    .eq('id', topicId)
    .single()
  console.log('rz', rz)
  // if (error) {
  //   throw createError({
  //     statusCode: 400,
  //     message: error.message
  //   })
  // }
  return {
    status: 200,
    message: "Market updated successfull,"
  };
});
