import React from "react";
import { Wallet } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-brand-green-light" />
            <span className="text-xl font-bold">AnonCapital</span>
          </div>
          <button className="bg-brand-green-light text-black px-4 py-2 rounded-lg hover:bg-brand-green-light/80 transition-all shadow-md hover:shadow-lg">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};
