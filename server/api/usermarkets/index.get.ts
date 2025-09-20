import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const { data, error }: any = await adminClient.from('userMarkets').select('*')
  .eq('userId', userId)
  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return { status: 200, data, }
});
