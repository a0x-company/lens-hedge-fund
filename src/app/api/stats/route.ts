import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { FundTokenDataError } from "@/types";

export async function GET(request: NextRequest) {
  const tokenAddress = request.nextUrl.searchParams
    .get("tokenAddress")
    ?.toLowerCase();

  if (!tokenAddress) {
    return NextResponse.json(
      { error: FundTokenDataError.TOKEN_ADDRESS_REQUIRED },
      { status: 400 }
    );
  }

  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
  const allFundTokenData: {
    [key: string]: {
      tokenAddress: string;
      stats: {
        label: string;
        value: string;
      }[];
      poolAddress: string;
      metrics: {
        label: string;
        value: string;
      }[];
    };
  } = JSON.parse(fileContents);
  /* Find token data by tokenAddress */
  const tokenData = allFundTokenData[tokenAddress];

  if (!tokenData) {
    return NextResponse.json(
      { error: FundTokenDataError.FUND_TOKEN_DATA_NOT_FOUND },
      { status: 404 }
    );
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/prices?poolAddress=${tokenData.poolAddress}`
    );
    const { priceTokenxWeth, priceWethxToken } = await response.json();
    const priceToken = tokenData.stats.find(
      (stat) => stat.label === "Price Token/WETH"
    );
    const priceWeth = tokenData.stats.find(
      (stat) => stat.label === "Price WETH/Token"
    );
    const marketCap = tokenData.metrics.find(
      (metric) => metric.label === "Market Cap"
    );
    if (priceToken && priceWeth) {
      priceToken.value = priceTokenxWeth.toFixed(12);
      priceWeth.value = priceWethxToken.toFixed(3);
    } else {
      tokenData.stats.push({
        label: "Price Token/WETH",
        value: priceTokenxWeth.toFixed(12),
      });
      tokenData.stats.push({
        label: "Price WETH/Token",
        value: priceWethxToken.toFixed(3),
      });
    }
    allFundTokenData[tokenAddress].stats = tokenData.stats;
    await fs.writeFile(
      jsonDirectory + "/data.json",
      JSON.stringify(allFundTokenData, null, 2)
    );
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  return NextResponse.json(tokenData.stats);
}
