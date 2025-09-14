export const supabaseStore = defineStore("supabaseStore", () => {
  const supabseUser = useSupabaseUser()

  const twitterIdentity = $computed(() => {
    return supabseUser.value?.identities?.find(
      identity => identity.provider === 'twitter'
    )
  })

  console.log(twitterIdentity, 'xxx')
  const x_user = $computed(() => ({
    id: twitterIdentity?.id,
    avatar: twitterIdentity?.identity_data?.avatar_url,
    name: twitterIdentity?.identity_data?.full_name,
    user_name: twitterIdentity?.identity_data?.user_name
  }))

  const hasTwitterLogin = $computed(() => !!twitterIdentity)



  return $$({
    supabseUser,
    twitterIdentity,
    x_user,
    hasTwitterLogin
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(supabaseStore, import.meta.hot));
}
