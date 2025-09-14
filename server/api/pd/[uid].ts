import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, 'uid')
  const adminClient = serverSupabaseServiceRole(event);

  console.log({ uid })

  let queryBuilder = adminClient
    .from("invites")
    .select(`*, x_profiles (*) `).eq('userId', uid).single();

  const { data, error } = await queryBuilder;

  if (error) throw createError({
    statusCode: 400,
    statusMessage: error.message
  });
  return data;

});
