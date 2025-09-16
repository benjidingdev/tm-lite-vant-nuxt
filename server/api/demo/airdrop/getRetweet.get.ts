import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const {network, reason} = getQuery(event)
  
  const rz = await adminClient.from('retweet').select()
    .eq('userId', userId)
    .eq('network', network)
    .eq('reason', reason)
    .single()

  return rz.data
});
