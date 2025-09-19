export function handleShare(x_user: any, topic: any) {
  const shareLink = new URL(location.href);
  shareLink.searchParams.append('refId', x_user.id)
  const text = `Turing Market has a topic of ${topic.title} ,Join the waitlist via ${shareLink.toString()}`;

  handleRetweet({
    hashtags: 'TuringM,TuringMaster,Airdrop',
    retweetTargetUrl: 'https://x.com/TuringMarket/status/1958786009753428017',
    text
  })
}
