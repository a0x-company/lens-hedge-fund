"use client";

import { Search } from "lucide-react";

// components

export default function Home() {
  const tokens = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$44,250.00",
      change: "+2.4%",
      marketCap: "$857.2B",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$2,290.15",
      change: "+3.1%",
      marketCap: "$275.4B",
    },
    {
      name: "USDC",
      symbol: "USDC",
      price: "$1.00",
      change: "0.0%",
      marketCap: "$42.1B",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      price: "$14.82",
      change: "+5.2%",
      marketCap: "$8.6B",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Invest in the Future of Finance
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access top-performing digital assets and start building your
            portfolio today
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Token Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {token.name}
                    </h3>
                    <p className="text-sm text-gray-500">{token.symbol}</p>
                  </div>
                </div>
                <span
                  className={`text-sm ${
                    token.change.startsWith("+")
                      ? "text-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  {token.change}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {token.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Market Cap: {token.marketCap}
                  </p>
                </div>
                <button className="text-emerald-500 hover:text-emerald-600 font-medium">
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
