export async function goToLInk(path: string, locale: any) {
  const url = locale === "en-US" ? path : `/${locale}${path}`;
  await navigateTo(url);
};
