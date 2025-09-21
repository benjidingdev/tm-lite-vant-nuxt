import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const query = getQuery(event);

  const { network } = query;

  let queryBuilder = adminClient
    .from("invites")
    .select(`*, x_profiles (*)`)
    .order("refCount", { ascending: false });

  if (network) {
    queryBuilder = queryBuilder.eq("network", network);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data;
});
