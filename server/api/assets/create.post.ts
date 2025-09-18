import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const pAmount = user?.pAmount || 0
  const adminClient = serverSupabaseServiceRole(event)

  const { data, err } = await adminClient.from('assets')
    .upsert({ userId, pAmount })
    .select()
    .eq('userId', userId)
    .single()

  if (err) {
    throw createError({
      statusCode: 400,
      message: 'Failed to create or update asset record'
    })
  }

  console.log({ data })
  // return userId + "'s latest pAmount" + pAmount;
  return {
    res: 200,
    data,
  }
});
