import domtoimage from 'dom-to-image';

export function getFatherInviteCode() {
  let startParams = {};

  let babse64Params = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
  // console.log(0, babse64Params);
  if (!babse64Params) {
    return startParams;
  }

  startParams = base64ToParams(babse64Params)
  return startParams;
}

export function paramsToBase64(params) {
  const urlParams = new URLSearchParams(params);
  const encodedParams = urlParams.toString();
  console.log({ encodedParams });

  const babse64Params = btoa(encodedParams);
  return babse64Params;
}

export function base64ToParams(babse64Params) {
  const params = {};
  try {
    const decodedString = atob(babse64Params);
    const urlParams = new URLSearchParams(decodedString);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    console.log(params, decodedString);
  } catch (error) {
    console.log('decode base64 error:', error);
  }
  return params;
}


export function inviteUser(inviteCode, redirect) {
  // console.log({ inviteCode, redirect });

  const botInfo = useRuntimeConfig().public.tgBotInfo || ''
  const babse64Params = paramsToBase64({ inviteCode, redirect });
  console.log({ botInfo });

  const miniAppUrl = `https://t.me/${botInfo}?startapp=${babse64Params}`;
  const shareUrl = `https://t.me/share/url?url=${miniAppUrl}`;
  if (window.Telegram) {
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
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
