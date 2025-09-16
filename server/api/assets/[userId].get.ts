import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  // const {network} = getQuery(event)
  console.log('userId------', { userId })

  const { data, error } = await adminClient.from('assets').select('*')
    .eq('userId', userId)
    .single()
  if (data === null) {
    return { status: 200, data: [] };
  }
  console.log({ data, error })
  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }


  return { status: 200, data, }
});
