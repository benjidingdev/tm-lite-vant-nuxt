import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)

  const { id: topicId } = getQuery(event)

  if (!topicId) {
    throw createError({
      statusCode: 400,
      message: 'Topic id is required',
      statusMessage: 'TopicIdRequired',
    })
  }

  const { data: topic } = await adminClient.from('topics').select('*').eq('id', topicId).single();
  if (!topic) {
    throw createError({
      statusCode: 400,
      message: 'Topic not found',
      statusMessage: 'TopicNotFound',
    })
  }

  console.log({ topicId })

  const { data } = await adminClient.from('invites')
    .select(`
      userId,
      reason,
      refCount,
      x_profiles(*)`)
    .eq('reason', `topic-${topicId}`)
    .order('refCount', { ascending: false })
    .limit(50)

  return {data, topic}
});
