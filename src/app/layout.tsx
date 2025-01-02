// next
import { headers } from "next/headers";

// styles
import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

// components
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/shadcn/toaster";

// tailwind
import { cn } from "@/lib/utils";

// wagmi & wallet-connect
import { cookieToInitialState } from "wagmi";
import Web3ModalProvider from "@/context";
import { wagmiAdapter } from "@/config";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig,
    headers().get("cookie")
  );

  return (
    <html lang="en">
      <Web3ModalProvider initialState={initialState}>
        <body className={cn("text-black", spaceGrotesk.className)}>
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Web3ModalProvider>
    </html>
  );
}
