"use client";

// react
import { ReactNode } from "react";

import { metadata, projectId, wagmiAdapter } from "@/config";

import { createAppKit } from "@reown/appkit/react";
import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { base } from "viem/chains";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined in context");

const lensSepolia = {
  id: 37111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: {
    name: "GRASS",
    symbol: "GRASS",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://block-explorer.testnet.lens.dev",
    },
  },
} as const;

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, lensSepolia],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
