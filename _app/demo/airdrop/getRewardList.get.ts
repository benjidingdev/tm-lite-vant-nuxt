import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event);
  const query = getQuery(event);

  const { network } = query;

  let queryBuilder = adminClient
    .from("nonce")
    .select(`
      created_at, reason, status, hash,
      dataForSign,
      twitterInfo
    `)
    .order("id", { ascending: false });

  if (network) {
    queryBuilder = queryBuilder.eq("network", network);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data;
});
