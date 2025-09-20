import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { market } = _.pick(bodyOrigin, ['market'])
  const yesMarkets = market?.yesMarkets || []
  const noMarkets = market?.noMarkets || []
  console.log('yesMarkets nomarkets', yesMarkets, noMarkets);

  if (yesMarkets === undefined && noMarkets === undefined) {
    throw createError({
      statusCode: 400,
      message: 'yesMarkets or noMarkets is required'
    })
  }

  const rz = await adminClient.from('userMarkets')
    .select('yesMarkets, noMarkets')
    .eq('userId', userId)
  if (rz.error) {
    throw createError({
      statusCode: 400,
      message: rz.error.message
    })
  }
  console.log('rz userMarkets', rz.data, 'rz?.data === []', rz?.data.length === 0);
  if (rz?.data.length === 0) {
    const rz2 = await adminClient.from('userMarkets')
      .insert({ userId, yesMarkets, noMarkets })

    if (rz2.error) {
      throw createError({
        statusCode: 400,
        message: rz2.error.message
      })
    }
    console.log('rz userMarkets', rz2.data);

    return {
      status: 200,
      message: "Market inserted successful"
    };
  }

  const rz3 = await adminClient.from('userMarkets')
    .update({ yesMarkets, noMarkets })
    .select()
    .eq('userId', userId)

  if (rz3.error) {
    throw createError({
      statusCode: 400,
      message: rz3.error.message
    })
  }
  console.log('data', rz3.data)

  return {
    status: 200,
    message: "Market updated successful"
  };
});
