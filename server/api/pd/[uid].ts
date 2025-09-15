import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, 'uid')
  if (!uid) throw createError({
    statusCode: 400,
    statusMessage: 'uid is required'
  });

  const adminClient = serverSupabaseServiceRole(event);

  console.log({ uid })

  let queryProfile = adminClient
    .from("x_profiles")
    .select(`*`).eq('id', uid).single();

    let queryInvite = adminClient
      .from("invites")
      .select(`refCount`).eq('userId', uid).single();

  const [{error: profileError, data: profileData}, {error: inviteError, data: inviteData}] = await Promise.all([queryProfile, queryInvite]);
  // console.log(profileError, inviteError)
  if (profileError || inviteError) throw createError({
    statusCode: 400,
    statusMessage: profileError?.message || inviteError?.message
  });
  return {
    ...profileData,
    refCount: inviteData?.refCount,
  };

});
