
export const useNavigateTo = async (path: string) => {
  const { setModal } = $(uiStore());
  // how to get locale in composable
  const nuxtApp = useNuxtApp()
  const locale = $(nuxtApp.$i18n.locale)
  const url = locale === "en-US" ? path : `/${locale}${path}`;
  setModal('settings', false);
  await navigateTo(url);
};
