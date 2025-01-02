"use client";

import { ReactNode } from "react";

import { base } from "@reown/appkit/networks";
import { metadata, projectId, wagmiAdapter } from "@/config";
import { createAppKit } from "@reown/appkit/react";

import { State, WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined in context");

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
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
