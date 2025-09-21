import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const { data } = await adminClient.from('assets').select('pAmount')
    .eq('userId', userId)
    .single()

  return { status: 200, data, }
});
