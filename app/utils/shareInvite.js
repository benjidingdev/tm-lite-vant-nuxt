export function getFatherInviteCode() {
  let code = "";
  if (window?.Telegram) {
    console.log(
      "window.Telegram.WebApp.initDataUnsafe",
      window.Telegram.WebApp.initDataUnsafe
    );
    const str = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (str) {
      code = str.split("inviteCode=")[1];
    }
  }

  const urlParams = new URLSearchParams(window?.location?.search);
  code = urlParams.get("inviteCode");
  return code;
}


export function inviteUser(inviteCode) {
  console.log({ inviteCode });

  const botUsername = "turingM_lite_bot";
  const appShortName = "tmLite";
  const params = `inviteCode=${inviteCode || "ChGQnC"}`;
  const miniAppUrl = `https://t.me/${botUsername}/${appShortName}?startapp=${params}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    miniAppUrl
  )}`;
  if (window.Telegram) {
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl);
  }
}
