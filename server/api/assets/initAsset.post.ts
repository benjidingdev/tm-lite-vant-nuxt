import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  console.log('===userId===', userId)
  const bodyOrigin = await readBody(event)
  const { pAmount } = _.pick(bodyOrigin, ['pAmount'])
  const adminClient = serverSupabaseServiceRole(event)
  console.log('bodyOrigin pAmount', pAmount)
  if (!pAmount) {
    throw createError({
      statusCode: 400,
      message: 'pAmount is required',
      statusMessage: 'pAmountRequired',
    })
  }
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'account is required',
      statusMessage: 'accountRequired',
    })
  }
  // query from assets table check if userId user has assets exists
  // if exists, update pAmount
  // if not exists, insert new record
  const { data: userAsset } = await adminClient.from('assets').select('pAmount')
    .eq('userId', userId)
    .single()
  console.log('pAmount', userAsset, userAsset?.pAmount)
  if (userAsset?.pAmount === undefined || userAsset?.pAmount === null) {
    const { data, error } = await adminClient.from('assets')
      .upsert({ pAmount, userId }, { onConflict: 'userId' })
      .select()
      .eq('userId', userId)
      .single()

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }
    return { res: 200, data, msg: 'Asset has been initialized' }
  }

  return {
    res: 200,
    data: userAsset?.pAmount,
    msg: "This user's asset is already exists, just show the asset",
  }
});
