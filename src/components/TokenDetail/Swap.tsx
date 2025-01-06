// react
import { useMemo, useState } from "react";

// components
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../shadcn/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";

// utils
import { cn } from "@/lib/utils";

// wagmi
import { useAccount, useReadContract, useReadContracts } from "wagmi";

// react-query
import { useQuery } from "@tanstack/react-query";

// viem
import { erc20Abi, formatUnits, parseUnits } from "viem";
import addresses from "@/constants/address";
import { useApprove } from "@/hooks/useApprove";
import { useSwap } from "@/hooks/useSwap";
import { base } from "viem/chains";

const getPrices = async (poolAddress: string) => {
  try {
    const price = await fetch(`/api/prices?poolAddress=${poolAddress}`);
    const data = await price.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function Swap({
  name,
  tokenAddress,
  poolAddress,
}: {
  name: string;
  tokenAddress: string;
  poolAddress: string;
}) {
  const [ethAmount, setEthAmount] = useState<string>("0.01");
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [currentMode, setCurrentMode] = useState("buy");
  const [isSufficientBalance, setIsSufficientBalance] = useState(true);
  const presets =
    currentMode === "buy"
      ? ["0.1 WETH", "0.5 WETH", "1 WETH", "5 WETH"]
      : ["5%", "10%", "25%", "50%", "100%"];

  /* Token Balance */
  const { address } = useAccount();
  const tokenBalance = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: addresses.wethAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: addresses.wethAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  });

  const tokenBalanceFormatted = useMemo(() => {
    if (!tokenBalance.data || tokenBalance.data.length < 2) return 0;
    return formatUnits(tokenBalance.data[0], tokenBalance.data[1]) || 0;
  }, [tokenBalance.data]);

  const wethBalanceFormatted = useMemo(() => {
    if (!tokenBalance.data || tokenBalance.data.length < 2) return 0;
    return formatUnits(tokenBalance.data[3], tokenBalance.data[4]) || 0;
  }, [tokenBalance.data]);

  const { data: priceToken } = useQuery({
    queryKey: ["priceToken", tokenAddress],
    queryFn: () => getPrices(poolAddress),
    enabled: !!poolAddress,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      const numericValue = parseFloat(value.replace(",", ".")) || 0;
      if (currentMode === "buy") {
        const wethBalance = parseFloat(wethBalanceFormatted.toString());
        setIsSufficientBalance(numericValue <= wethBalance);
        setEthAmount(value);
        setTokenAmount((numericValue / priceToken.priceTokenxWeth).toFixed(3));
      } else {
        const numericTokenBalance = parseFloat(
          tokenBalanceFormatted.toString()
        );
        setIsSufficientBalance(numericValue <= numericTokenBalance);
        setEthAmount((numericValue / priceToken.priceWethxToken).toFixed(3));
        setTokenAmount(value);
      }
    }
  };

  /* Swap */
  const [isApproved, setIsApproved] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    chainId: base.id,
    abi: erc20Abi,
    functionName: "allowance",
    args: [
      address!,
      currentMode === "buy"
        ? (addresses.wethAddress as `0x${string}`)
        : (tokenAddress as `0x${string}`),
    ],
    query: {
      enabled: !!address,
    },
  });

  const tokenAmountFormatted = parseUnits(tokenAmount, 18);
  const wethAmountFormatted = parseUnits(ethAmount, 18);

  const isAllowanceSufficient =
    currentMode === "buy"
      ? allowance! < wethAmountFormatted
      : allowance! < tokenAmountFormatted;

  const {
    write: writeApprove,
    isLoading: isLoadingApprove,
    simulate: simulateApprove,
    wait: waitApprove,
  } = useApprove(
    currentMode === "buy"
      ? (addresses.wethAddress as `0x${string}`)
      : (tokenAddress as `0x${string}`),
    name,
    addresses.deployerAddress as `0x${string}`,
    isAllowanceSufficient,
    currentMode === "buy" ? wethAmountFormatted : tokenAmountFormatted,
    () => setIsApproved(true)
  );

  console.log("waitApprove", waitApprove);

  const handleApprove = async () => {
    if (simulateApprove.data?.request != null) {
      writeApprove?.writeContract(simulateApprove?.data?.request);
    }
  };

  const amountIn =
    currentMode === "buy" ? wethAmountFormatted : tokenAmountFormatted;
  const tokenIn =
    currentMode === "buy"
      ? (addresses.wethAddress as `0x${string}`)
      : (tokenAddress as `0x${string}`);
  const tokenOut =
    currentMode === "buy"
      ? (tokenAddress as `0x${string}`)
      : (addresses.wethAddress as `0x${string}`);

  const {
    write: writeSwap,
    simulate: simulateSwap,
    isLoading: isLoadingSwap,
  } = useSwap(
    addresses.deployerAddress as `0x${string}`,
    amountIn,
    tokenIn,
    tokenOut,
    isApproved,
    () => setIsSwapped(true)
  );

  const handleSwap = async () => {
    console.log(simulateSwap.data, simulateSwap);
    if (simulateSwap.data?.request != null) {
      writeSwap?.writeContract(simulateSwap?.data?.request);
    }
  };

  return (
    <DialogContent className="bg-white">
      <DialogTitle className="text-center">
        What would you like to do?
      </DialogTitle>
      <Tabs
        defaultValue="buy"
        onValueChange={setCurrentMode}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger
            className="w-full text-xl data-[state=active]:bg-brand-green-light data-[state=active]:text-black"
            value="buy"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            className="w-full text-xl data-[state=active]:bg-brand-green-light data-[state=active]:text-black"
            value="sell"
          >
            Sell
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="flex flex-col items-center gap-4">
          <div className="flex justify-between gap-2 w-full mt-4">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setEthAmount(preset)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="flex flex-col w-full justify-between items-center relative">
            <label
              htmlFor="ethAmount"
              className="text-[18px] font-[700] text-secondary self-start"
            >
              You Pay
            </label>
            <input
              value={ethAmount}
              onChange={handleInputChange}
              className={cn(
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px] text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
                // isSufficientBalance ? "bg-white" : "bg-red-500/20"
              )}
              placeholder={`Enter WETH amount`}
            />

            <div className="flex absolute right-2 bottom-2 gap-[8px]">
              <p className="text-[18px] font-[700] text-secondary">WETH</p>
            </div>
          </div>

          <div className="flex flex-col w-full justify-between items-center relative">
            <label
              htmlFor="tokenAmount"
              className="text-[18px] font-[700] text-secondary self-start"
            >
              You Receive
            </label>
            <input
              value={tokenAmount}
              disabled
              className={cn(
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px] text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
                // isSufficientBalance ? "bg-white" : "bg-red-500/20"
              )}
            />

            <div className="flex absolute right-2 bottom-2 gap-[8px]">
              <p className="text-[18px] font-[700] text-secondary">{name}</p>
            </div>
          </div>
          {isLoadingApprove || isLoadingSwap ? (
            <p className="bg-brand-green-light hover:bg-brand-green-light/80 transition-colors text-black px-4 py-2 rounded-md w-full opacity-50 cursor-not-allowed text-center">
              Loading...
            </p>
          ) : (
            <button
              onClick={() => {
                if (isApproved && !isSwapped) {
                  handleSwap();
                } else {
                  handleApprove();
                }
              }}
              disabled={isLoadingApprove || isLoadingSwap}
              className="bg-brand-green-light hover:bg-brand-green-light/80 transition-colors text-black px-4 py-2 rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproved && !isSwapped ? "BUY" : "APPROVE"} {name}
              {isApproved && isSwapped ? "Swapped Successfully" : ""}
            </button>
          )}
        </TabsContent>
        <TabsContent value="sell" className="flex flex-col items-center gap-4">
          <div className="flex justify-between gap-2 w-full mt-4">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  if (currentMode === "sell") {
                    const percentage = parseFloat(preset) / 100;
                    setTokenAmount(
                      (Number(tokenBalanceFormatted) * percentage).toFixed(3)
                    );
                  } else {
                    setEthAmount(
                      (Number(preset) / Number(tokenBalanceFormatted)).toFixed(
                        2
                      )
                    );
                    const price = priceToken.priceWethxToken;
                    setTokenAmount((Number(preset) / price).toFixed(3));
                  }
                }}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="flex flex-col w-full justify-between items-center relative">
            <label
              htmlFor="tokenAmount"
              className="text-[18px] font-[700] text-secondary self-start"
            >
              You Pay
            </label>
            <input
              value={tokenAmount}
              disabled
              className={cn(
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px] text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
                // isSufficientBalance ? "bg-white" : "bg-red-500/20"
              )}
            />

            <div className="flex absolute right-2 bottom-2 gap-[8px]">
              <p className="text-[18px] font-[700] text-secondary">{name}</p>
            </div>
          </div>

          <div className="flex flex-col w-full justify-between items-center relative">
            <label
              htmlFor="ethAmount"
              className="text-[18px] font-[700] text-secondary self-start"
            >
              You Receive
            </label>
            <input
              value={ethAmount}
              //   onChange={handleInputChange}
              className={cn(
                "w-full font-normal border border-secondary rounded-[8px] p-[8px] text-[18px] text-secondary selection:text-secondary placeholder:text-secondary focus:outline-none"
                // isSufficientBalance ? "bg-white" : "bg-red-500/20"
              )}
            />

            <div className="flex absolute right-2 gap-[8px]">
              <p className="text-[18px] font-[700] text-secondary">WETH</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isApproved && !isSwapped) {
                handleSwap();
              } else {
                handleApprove();
              }
            }}
            disabled={isLoadingApprove || isLoadingSwap}
            className="bg-brand-green-light hover:bg-brand-green-light/80 transition-colors text-black px-4 py-2 rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproved && !isSwapped ? "SELL" : "APPROVE"} {name}
            {isLoadingApprove || isLoadingSwap ? "Loading..." : ""}
            {isApproved && isSwapped ? "Swapped Successfully" : ""}
          </button>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <DialogClose className="ml-2">Close</DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
