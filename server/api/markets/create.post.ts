// import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
// import _ from 'lodash'

// export default defineEventHandler(async (event) => {
//   const user = await serverSupabaseUser(event)
//   const userId = user?.id as string
//   const adminClient = serverSupabaseServiceRole(event)
//   const bodyOrigin = await readBody(event)
//   const { topicsId } = _.pick(bodyOrigin, ['topicsId'])
//   const { name } = _.pick(bodyOrigin, ['name'])
//   const { meta } = _.pick(bodyOrigin, ['meta'])

//   const { data, error } = await adminClient.from('markets')
//     .upsert({ meta, name, topicsId, userId })
//     .select()
//     .eq('topicsId', topicsId)
//     .single()

//   if (error) {

//     throw createError({
//       statusCode: 400,
//       message: error.message
//     })
//   }

//   console.log({ data })
//   return {
//     res: 200,
//     data,
//   }
// });
