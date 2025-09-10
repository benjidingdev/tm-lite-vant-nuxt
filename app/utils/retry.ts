export async function retryAsyncFn(fn: Function, retries = 3, delay = 0) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}

export async function _initWallet($PrivySDK: any, session: any, $privy: any, wallet: any, createWalletClient: any, createPublicClient: any, custom: any, networks: any) {
  try {
    let theWallet = $PrivySDK.getUserEmbeddedWallet(session!.user);
    console.log("theWallet", theWallet);
    if (!theWallet) {
      theWallet = await $privy.embeddedWallet.create({});
      session = await $privy.user.get();
    }

    const { entropyId, entropyIdVerifier } =
      $PrivySDK.getEntropyDetailsFromUser(session!.user);
    console.log('xxx', {
      wallet,
      entropyId,
      entropyIdVerifier,
    }, session)

    const provider = await $privy.embeddedWallet.getEthereumProvider({
      wallet,
      entropyId,
      entropyIdVerifier,
    });

    const walletClient = createWalletClient({
      account: wallet.address,
      chain: networks[0],
      transport: custom(provider),
    });
    const publicClient = createPublicClient({
      chain: networks[0],
      transport: custom(provider),
    });
    return { walletClient, publicClient };
  } catch (error: Error | any) {
    throw error;
  }
}
