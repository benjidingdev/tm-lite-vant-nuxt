import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event)
  const {network, address} = getQuery(event)
  const tgBindNonceDB = adminClient.from('tgBindNonce')
  
  const rz = await tgBindNonceDB.select('status')
    .eq('network', network)
    .eq('address', address)
    .single()

  return rz.data
});