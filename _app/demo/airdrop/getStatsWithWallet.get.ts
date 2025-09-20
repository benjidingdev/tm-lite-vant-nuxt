import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  const adminClient = serverSupabaseServiceRole(event)
  const {address, network} = getQuery(event)
  
  const rz = await adminClient.from('tgBindNonce').select()
    .eq('address', address)
    .eq('network', network)
    .single()

  if(!rz.data){
    return []
  }
  if(rz.data.status == 'binded' || rz.data.status == 'signed'){
    return ['bind-with-telegram:binded']
  }
  if(rz.data.status == 'successed'){
    return ['airdrop:bind-with-telegram']
  }
  return []
});
