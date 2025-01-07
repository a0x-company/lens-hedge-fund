// React
import { useState } from "react";

// Onchain
import LENS_CAPITAL_ABI from "@/onchain/abi/lens-capital.json";

// Wagmi
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export function useCreateFund() {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const {
    writeContract,
    data: hash,
    isPending,
    isSuccess,
    status,
  } = useWriteContract();

  console.log("isPending", isPending);
  console.log("isSuccess", isSuccess);
  console.log("status", status);
  const createFund = async (params: { name: string; symbol: string }) => {
    try {
      await writeContract({
        address: "0x873d5852894f68D6343d0E673EaE6486E317D246" as `0x${string}`,
        abi: LENS_CAPITAL_ABI,
        functionName: "deployFunds",
        args: [
          params.name,
          params.symbol,
          "https://pbs.twimg.com/profile_images/1858644018655100928/NOO-S785_400x400.jpg",
        ],
      });

      setTxHash(hash);

      return hash;
    } catch (error) {
      console.error("Error creating fund:", error);
      throw error;
    }
  };

  return {
    createFund,
    hash,
    isPending,
    isSuccess,
    status,
  };
}
