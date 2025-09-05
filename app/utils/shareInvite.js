import domtoimage from 'dom-to-image';

export function getFatherInviteCode() {
  const startParams = {
    code: '',
    redirect: ''
  };

  try {
    let queryString = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
    // console.log(queryString);
    if (!queryString) {
      return startParams;
    }

    queryString = atob(queryString);

    const urlParams = new URLSearchParams(queryString);
    startParams.code = urlParams.get("inviteCode");
    startParams.redirect = urlParams.get("redirect");
  } catch (error) {

  }

  return startParams;
}


export function inviteUser(inviteCode, redirect) {
  console.log({ inviteCode, redirect });

  const botInfo = process.env.NUXT_PUBLIC_TG_BOT_INFO || '::'
  const [botUsername, appShortName] = botInfo.split('::');

  const params = new URLSearchParams();
  params.append("inviteCode", inviteCode || "");
  params.append("redirect", redirect || "");

  const encodedParams = params.toString();
  const babse64Params = btoa(encodedParams);
  console.log({ encodedParams, babse64Params });

  const miniAppUrl = `https://t.me/${botUsername}/${appShortName}?startapp=${babse64Params}`;
  const shareUrl = `https://t.me/share/url?url=${miniAppUrl}`;
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
