import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, defineChain } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";

export const projectId = "49c1dac0343e834e4d7785679951c3cc"; // process.env.NEXT_PUBLIC_PROJECT_ID;

// const chain = process.env.NODE_ENV === "development" ? sepolia : base;

if (!projectId) throw new Error("Project ID is not defined in config");

export const metadata = {
  name: "Lens Hedge Fund",
  description: "Lens Hedge Fund",
  url: "https://lens-hedge-fund.vercel.app",
  icons: ['"https://lens-hedge-fund.vercel.app/assets/anoncapital-logo.svg"'],
};

const sourceId = 1; // mainnet

// export const lensSepolia = /*#__PURE__*/ defineChain({
//   ...chainConfig,
//   id: 37111,
//   name: 'Lens Network Sepolia Testnet',
//   nativeCurrency: { name: 'GRASS', symbol: 'GRASS', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ['https://mainnet.base.org'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'Basescan',
//       url: 'https://basescan.org',
//       apiUrl: 'https://api.basescan.org/api',
//     },
//   },
//   contracts: {
//     ...chainConfig.contracts,
//     disputeGameFactory: {
//       [sourceId]: {
//         address: '0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e',
//       },
//     },
//     l2OutputOracle: {
//       [sourceId]: {
//         address: '0x56315b90c40730925ec5485cf004d835058518A0',
//       },
//     },
//     multicall3: {
//       address: '0xca11bde05977b3631167028862be2a173976ca11',
//       blockCreated: 5022,
//     },
//     portal: {
//       [sourceId]: {
//         address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
//         blockCreated: 17482143,
//       },
//     },
//     l1StandardBridge: {
//       [sourceId]: {
//         address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
//         blockCreated: 17482143,
//       },
//     },
//   },
//   sourceId,
// })

const lensSepolia = {
  chainId: 37111,
  name: "Lens Network Sepolia Testnet",
  currency: "GRASS",
  explorerUrl: "https://block-explorer.testnet.lens.dev",
  rpcUrl: "https://rpc.testnet.lens.dev",
} as any;

export const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, lensSepolia],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});
