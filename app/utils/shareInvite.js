import domtoimage from 'dom-to-image';

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

async function getImageFromProxy(img) {
  console.log('load img from proxy:', img.src);
  return $fetch('/api/proxy/image', {
    method: 'POST',
    body: {
      url: img.src
    },
  });
}

export async function captureTargetToPng(name = 'shareImageName', target) {
  if (!target) {
    return;
  }

  const imgElements = target.querySelectorAll('img');
  const promises = Array.from(imgElements).filter(img => img.src.startsWith('http')).map(img => getImageFromProxy(img));

  const base64Urls = await Promise.all(promises);

  imgElements.forEach((img, index) => {
    if (base64Urls[index]) {
      img.src = URL.createObjectURL(base64Urls[index]);
    }
  });

  const blob = await domtoimage.toBlob(target);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${name}.png`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
