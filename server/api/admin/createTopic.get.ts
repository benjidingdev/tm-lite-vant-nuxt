import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import all from '#shared/data/topics/all'
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const data = all[id]
  // const adminClient = serverSupabaseServiceRole(event)
  return {
    id,
    data
  }
});
