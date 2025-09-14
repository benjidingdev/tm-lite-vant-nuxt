import { serverSupabaseServiceRole } from "#supabase/server";
export default defineEventHandler(async (event) => {
  // get top 50 inviter, order by refCount
  const {data} = await serverSupabaseServiceRole(event).from('invites')
    .select()
    .order('refCount', { ascending: false })
    .limit(50)

  return data
});
