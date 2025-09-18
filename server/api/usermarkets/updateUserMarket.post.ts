import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { markets } = _.pick(bodyOrigin, ['markets'])
  const yesMarkets = markets?.yesMarkets || []
  const noMarkets = markets?.noMarkets || []
  console.log('yesMarkets nomarkets', yesMarkets, noMarkets);

  if (yesMarkets === undefined && noMarkets === undefined) {
    throw createError({
      statusCode: 400,
      message: 'yesMarkets or noMarkets is required'
    })
  }

  const { data, error } = await adminClient.from('userMarkets')
    .upsert({ yesMarkets: [1, 2, 3], noMarkets: {}, userId }, { onConflict: 'userId' })
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
    status: 200,
    message: "Market updated successful" + data
  };
});
