import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { pAmount } = _.pick(bodyOrigin, ['pAmount'])

  console.log('pAmount', pAmount)

  const { err } = await adminClient.from('assets')
    .update({ pAmount })
    .eq('userId', userId)
    .single()
  if (err) {
    throw createError({
      statusCode: 400,
      message: err.message
    })
  }
  return userId + "'s latest pAmount" + pAmount;
});
