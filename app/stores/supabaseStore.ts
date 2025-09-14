export const supabaseStore = defineStore("supabaseStore", () => {
  const supabseUser = useSupabaseUser()
  const client = useSupabaseClient()


  const twitterIdentity = $computed(() => {
    return supabseUser.value?.identities?.find(
      identity => identity.provider === 'twitter'
    )
  })

  const x_user = $computed(() => ({
    id: supabseUser.value?.id,
    avatar: twitterIdentity?.identity_data?.avatar_url,
    name: twitterIdentity?.identity_data?.full_name,
    user_name: twitterIdentity?.identity_data?.user_name,
    refCount: 0,
  }))

  const hasTwitterLogin = $computed(() => !!twitterIdentity)

  const doLogin = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${location.origin}/confirm?redirectTo=${encodeURIComponent('/pd')}`,
      },
    })
    if (error) {
      console.log('error', error)
    }
    if (data) {
      console.log('data', data)
    }
    if (data?.url) {
      window.location.href = data.url
    }
  }

  const doLogout = async () => {
    const rz = await client.auth.signOut()
    console.log(rz)
  }

  return $$({
    supabseUser,
    twitterIdentity,
    x_user,
    hasTwitterLogin,
    doLogin,
    doLogout
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(supabaseStore, import.meta.hot));
}
