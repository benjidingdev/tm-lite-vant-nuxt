import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { markets } = _.pick(bodyOrigin, ['markets'])
  const { topicId } = _.pick(bodyOrigin, ['topicId'])

  const rz = await adminClient.from('userMarkets')
    .update({ markets })
    .eq('id', topicId)
    .single()

  return {
    status: 200,
    message: "Market updated successful"
  };
});
