import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const bodyOrigin = await readBody(event)
  const { pAmount } = _.pick(bodyOrigin, ['pAmount'])

  const { data } = await adminClient.from('assets').select('*')
    .eq('userId', userId)
    .single()
  if (data?.pAmount <= 0) {
    return { status: 400, message: "pAmount cannot be zero" };
  }

  const { data: assetData, error: updateAmountError } = await adminClient.from('assets')
    .upsert({
      pAmount,
      userId,
    }, { onConflict: 'userId' })
    .select()
    .eq('userId', userId)
    .single()

  if (updateAmountError) {
    throw createError({
      statusCode: 400,
      message: updateAmountError.message
    })
  }
  return "latestpAmount" + assetData.pAmount;
});
