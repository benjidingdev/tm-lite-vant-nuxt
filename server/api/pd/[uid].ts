import { serverSupabaseServiceRole } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, 'uid')
  const adminClient = serverSupabaseServiceRole(event);

  console.log({ uid })

  let queryBuilder = adminClient
    .from("invites")
    .select(`*`).eq('userId', uid);

  const { data, error } = await queryBuilder;

  if (error) throw createError({
    statusCode: 400,
    statusMessage: error.message
  });
  return data;

});
