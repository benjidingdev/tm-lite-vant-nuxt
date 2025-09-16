import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = user?.id as string
  const adminClient = serverSupabaseServiceRole(event)
  const {network} = getQuery(event)
  
  const rz = await adminClient.from('nonce').select('reason')
    .eq('userId', userId)
    .eq('network', network)
    .eq('status', 'successed')

  return rz.data.map(item => item.reason)
});
