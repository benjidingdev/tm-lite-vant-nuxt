import axios from "axios";

export const retrieveAttestation = async (domain: number, transactionHash: string) => {
  const url = `https://iris-api-sandbox.circle.com/v2/messages/${domain}?transactionHash=${transactionHash}`;
  while (true) {
    try {
      const response = await axios.get(url);
      if (response.status === 404) {
      }
      if (response.data?.messages?.[0]?.status === "complete") {
        return response.data.messages[0];
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error: any) {
      console.error("Error fetching attestation:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
