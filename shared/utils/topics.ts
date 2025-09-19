export default function () {
  return [
    {
      id: 1,
      title: 'Who will be the biggest winner when the Monad mainnet goes live?',
      content: 'Content 1',
      rewards: {
        auth: 1000,
        invite: 1000,
        retweet: 100,
      }
    }
  ]
}


export const test = {
  logo: '/predmoon.png',
  rewards: {
    auth: 1000,
    invite: 1000,
    retweet: 100,
  },
  x_info: {
    retweetTargetLink: 'https://x.com/TuringMarket/status/1958786009753428017',
    text: 'Turing Market has a topic of {{title}} ,Claim the reward via {{url}}'
  }
}
