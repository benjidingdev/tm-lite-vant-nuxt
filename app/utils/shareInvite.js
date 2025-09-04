import domtoimage from 'dom-to-image';

export function getFatherInviteCode() {
  const startParams = {
    code: '',
    redirect: ''
  };

  if (window?.Telegram) {
    console.log(
      "window.Telegram.WebApp.initDataUnsafe",
      window.Telegram.WebApp.initDataUnsafe
    );
    const str = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
    console.log({ str });

    if (str) {
      let regex = /(\w+)=([^&]+)/g;
      let match;

      while ((match = regex.exec(str)) !== null) {
        let key = match[1];
        let value = match[2];

        startParams[key] = value;
      }
    }

    console.log({ startParams });
    // return startParams;
  }

  const urlParams = new URLSearchParams(window?.location?.search);
  startParams.code = urlParams.get("inviteCode");
  startParams.redirect = urlParams.get("redirect");

  console.log({ startParams });
  return startParams;
}


export function inviteUser(inviteCode, redirect) {
  console.log({ inviteCode });

  const botUsername = "turingM_lite_bot";
  const appShortName = "tmLite";
  const params = `inviteCode=${inviteCode || ""}&redirect=${redirect || ""}`;
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
