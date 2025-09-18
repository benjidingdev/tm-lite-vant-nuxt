import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
   const user = await serverSupabaseUser(event)

   const adminClient = serverSupabaseServiceRole(event)

  // return {
  //   content: "欢迎参与 Interest 活动！后续公告会在这里更新～",
  //   lang: "zh-CN",
  //   updatedAt: new Date().toISOString(),
  // }
})
