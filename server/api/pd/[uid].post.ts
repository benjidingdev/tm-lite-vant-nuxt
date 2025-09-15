import { serverSupabaseServiceRole } from "#supabase/server";
import _ from 'lodash'

export default defineEventHandler(async (event) => {
  // const adminClient = serverSupabaseServiceRole(event);
  // const query = getQuery(event);

  // const { network } = query;

  // let queryBuilder = adminClient
  //   .from("x_profiles")
  //   .select(`*`)
  //   .order("id", { ascending: false });

  // if (network) {
  //   queryBuilder = queryBuilder.eq("network", network);
  // }

  // const { data, error } = await queryBuilder;

  // if (error) throw error;
  // return data;

  const uid = getRouterParam(event, 'uid')
  const body = await readBody(event)
  console.log({ body })
  return `Hello, ${uid}!`

});
