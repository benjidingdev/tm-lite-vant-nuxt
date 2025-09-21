const LINK_CONSTANTS = {
  email_official: "turingmarket@gmail.com",
  x_official: "https://www.x.com",
  telegram_official: "https://t.me",
  binance_official: "https://www.binance.com",
  discord_official: "https://discord.com",
};

export const SHARE_URL = (path: string, inviteCode: string) => {
  if (!inviteCode) {
    return `${useRequestURL().href}${path}`;
  }
  return `${useRequestURL().href}${path}?inviteCode=${inviteCode}`;
};

export const TELEGRAM_SHARE_URL = (shareText: string) => {
  return `${
    LINK_CONSTANTS.telegram_official
  }/share/url?text=${encodeURIComponent(shareText)}&url=%23TuringMarket`;
};

export const X_SHARE_URL = (shareText: string) => {
  return `${LINK_CONSTANTS.x_official}/intent/post?text=${encodeURIComponent(
    shareText
  )}`;
};

export const BINANCE_SHARE_URL = (shareText: string) => {
  return `${LINK_CONSTANTS.binance_official}/square?text=${encodeURIComponent(
    shareText
  )}&url=%23TuringMarket`;
};

// market share text
export const SHARE_MARKET_TEXT = (
  topicTitle: string,
  marketData: any,
  url: string
) => {
  const returnAmount = Math.floor(
    100 /
      (marketData.noPrice < marketData.yesPrice
        ? marketData.noPrice
        : marketData.yesPrice)
  );

  return [
    `🚨 HOT MARKET ALERT: ${topicTitle}

YES odds: ${marketData.yesPrice * 100}%

NO odds: ${marketData.noPrice * 100}%

💰 A $100 bet on ${
      marketData.noPrice < marketData.yesPrice
        ? marketData.noName
        : marketData.yesName
    } returns $${returnAmount} if correct.
👉 Don’t miss out — the market is moving fast! 🔥
${url}`,

    `🔥 Everyone’s betting on ${topicTitle}

📊 Current odds:
YES — ${marketData.yesPrice * 100}%
NO — ${marketData.noPrice * 100}%

💵 If you put $100 on ${
      marketData.noPrice < marketData.yesPrice
        ? marketData.noName
        : marketData.yesName
    }, you’d get $${returnAmount} back!
⚡️ Will you catch the wave or stay on the sidelines?
${url}`,
  ];
};

// position share text
export const SHARE_POSITION_TEXT = (
  topicTitle: string,
  positionData: any,
  url: string
) => {
  return [
    `📊 Just took ${positionData.typeName} with ${positionData.holdVolume} on ${topicTitle}!
Feeling confident — but the market could surprise us. 🔮
What’s your call? Join the market & place your prediction 👇
👉 ${url}`,

    `🔥 My latest move: ${positionData.typeName}, ${positionData.holdVolume} on ${topicTitle}.
Think I’m on the right side, or ready to fade me? 💡
Jump in and make your forecast now!
👉 ${url}`,
  ];
};
