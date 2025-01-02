import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";

export const projectId = "49c1dac0343e834e4d7785679951c3cc"; // process.env.NEXT_PUBLIC_PROJECT_ID;

// const chain = process.env.NODE_ENV === "development" ? sepolia : base;

if (!projectId) throw new Error("Project ID is not defined in config");

export const metadata = {
  name: "AnonCapital",
  description: "Tokens Funded",
  url: "https://anoncapital.xyz/",
  icons: ['"https://anoncapital.xyz/assets/anoncapital-logo.svg"'],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});
