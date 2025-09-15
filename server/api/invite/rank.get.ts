import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const {data, error} = await adminClient.from('invites')
    .select(`
      userId,
      refCount,
      x_profiles(*)`)
    .order('refCount', { ascending: false })
    .limit(50)

  return data
});
