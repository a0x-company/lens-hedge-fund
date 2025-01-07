"use client";

// Next
import { useRouter } from "next/navigation";

// Icons
import { Search } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const funds = [
    {
      name: "test",
      symbol: "TEST1",
      price: "$1",
      change: "",
      marketCap: "$10000",
      address: "0x6914c5b9ab9b49bcf84f980ff773bf2ae6186a6d",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/50">
      {/* Hero Section with mesh gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-blue-100/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 mb-4">
              Manage a Hedge Fund
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create your own tokenized investment fund and let others buy your
              token, fully backed by real assets. Start with just 0.2 WETH and
              build a community around your portfolio.
            </p>

            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => router.push("/create-fund")}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                Create Fund
              </button>
              <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-3 rounded-lg font-medium transition-all border border-gray-200 shadow-sm">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white">
                <h3 className="text-emerald-500 font-semibold mb-2">
                  Easy Start
                </h3>
                <p className="text-gray-600">
                  Begin with 0.2 WETH - split between assets and liquidity pool
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white">
                <h3 className="text-emerald-500 font-semibold mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  Let investors participate by buying your fund tokens
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white">
                <h3 className="text-emerald-500 font-semibold mb-2">
                  Full Control
                </h3>
                <p className="text-gray-600">
                  Manage assets and trading strategies your way
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funds Grid with mesh gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-emerald-100/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
              Active Funds
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search funds..."
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund) => (
              <button
                key={fund.symbol}
                onClick={() =>
                  router.push(`/${fund.name}?token=${fund.address}`)
                }
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100 text-left hover:bg-white group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{fund.name}</h3>
                    <p className="text-sm text-gray-500">{fund.symbol}</p>
                  </div>
                  <span className="text-sm text-emerald-500">
                    {fund.change}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {fund.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Market Cap: {fund.marketCap}
                    </p>
                  </div>
                  <span className="text-emerald-500 font-medium group-hover:translate-x-1 transition-transform">
                    View Details →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
