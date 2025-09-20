// import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

// export default defineEventHandler(async (event) => {
//   const bodyOrigin = await readBody(event)
//   const { topicId } = _.pick(bodyOrigin, ['topicId'])
//   const adminClient = serverSupabaseServiceRole(event)

//   const { data, error } = await adminClient.from('topics').select('*')
//     .eq('userId', topicId)
//     .single()
//   if (data === null) {
//     return { status: 200, data: [] };
//   }
//   if (error) {
//     throw createError({
//       statusCode: 400,
//       message: error.message
//     })
//   }


//   return { status: 200, data, }
// });
