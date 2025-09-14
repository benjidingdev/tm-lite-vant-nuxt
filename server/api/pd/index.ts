import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const query = getQuery(event);

  const { network } = query;

  let queryBuilder = adminClient
    .from("x_profiles")
    .select(`*`)
    .order("id", { ascending: false });

  if (network) {
    queryBuilder = queryBuilder.eq("network", network);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data;
});
