// next
import { NextRequest, NextResponse } from "next/server";
// constants
import poolContractABI from "@/constants/pool-v3-abi.json";
// ethers
import { ethers } from "ethers";
import { base } from "viem/chains";

const getPrices = async (poolAddress: string) => {
  const provider = new ethers.JsonRpcProvider(base.rpcUrls.default.http[0]);
  const poolContract = new ethers.Contract(
    poolAddress,
    poolContractABI,
    provider
  );
  try {
    console.log("poolContract", poolContract);
    const slot0 = await poolContract.slot0();
    console.log("slot0", slot0);
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    console.log("sqrtPriceX96", sqrtPriceX96);
    const priceTokenxWeth =
      (Number(sqrtPriceX96) / 2 ** 96) ** 2 * 10 ** (18 - 6);
    const priceWethxToken = 1 / priceTokenxWeth;
    console.log("Price Token/WETH:", priceTokenxWeth.toFixed(3));
    console.log("Price WETH/Token:", priceWethxToken.toFixed(3));
    return { priceTokenxWeth, priceWethxToken };
  } catch (error) {
    console.error("Error al obtener la información del token:", error);
    return { error: "Error fetching token price" };
  } finally {
    provider.destroy();
  }
};

export async function GET(request: NextRequest) {
  console.info("[GET][/api/prices]");
  const poolAddress = request.nextUrl.searchParams.get("poolAddress");
  if (!poolAddress) {
    return NextResponse.json(
      { error: "Pool address is required" },
      { status: 400 }
    );
  }
  try {
    const { priceTokenxWeth, priceWethxToken } = await getPrices(poolAddress);
    return NextResponse.json(
      {
        message: "✅ Price fetched successfully",
        priceTokenxWeth,
        priceWethxToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Error fetching token price" },
      { status: 500 }
    );
  }
}
