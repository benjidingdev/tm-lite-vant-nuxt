export const xAvatar = (avatar: string) => {
  if(!avatar) return '/logo.png'
  return avatar.replace('_normal', '')
}
