"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

export const Navbar: React.FC = () => {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-brand-green-light" />
            <span className="text-xl font-bold">Capital Friends</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open()}
              className="bg-brand-gray text-white px-4 py-2 rounded-lg hover:bg-brand-gray/80 transition-all shadow-md hover:shadow-lg"
            >
              Create Fund
            </button>
            <button
              onClick={() => open()}
              className="bg-brand-green-light text-black px-4 py-2 rounded-lg hover:bg-brand-green-light/80 transition-all shadow-md hover:shadow-lg"
              suppressHydrationWarning
            >
              {isConnected
                ? address!.slice(0, 6) + "..." + address!.slice(-4)
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
