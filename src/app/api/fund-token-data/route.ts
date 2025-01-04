import { FundTokenDataError } from "@/types";
import { ethers } from "ethers";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { base } from "viem/chains";

import deployerContractABI from "@/constants/deployer-abi.json";
import addresses from "@/constants/address";

const setRandomColorToToken = (colorsHaveBeenUsed: string[]) => {
  const colors = [
    "#1E88E5",
    "#43A047",
    "#7CB342",
    "#546E7A",
    "#EC407A",
    "#FB8C00",
    "#2EBD85",
    "#35FC95",
    "#2B3139",
    "#546E7A",
    "#EC407A",
    "#FB8C00",
    "#2EBD85",
    "#35FC95",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  const color = colors[randomIndex];
  if (colorsHaveBeenUsed.includes(color)) {
    return setRandomColorToToken(colorsHaveBeenUsed);
  }
  return color;
};

const getTokenInfo = async (tokenName: string) => {
  const provider = new ethers.JsonRpcProvider(base.rpcUrls.default.http[0]);
  const deployerContract = new ethers.Contract(
    addresses.deployerAddress,
    deployerContractABI,
    provider
  );
  try {
    const tokenInfo = await deployerContract.getTokenInfo(tokenName);
    return tokenInfo;
  } catch (error) {
    console.error("Error fetching token info:", error);
    return { error: "Error fetching token info" };
  } finally {
    provider.destroy();
  }
};

const assetsFromTreasury = async (treasuryAddress: string) => {
  const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
  const MORALIS_API_URL = `https://deep-index.moralis.io/api/v2.2/wallets/${treasuryAddress}/tokens`;
  try {
    const response = await fetch(MORALIS_API_URL, {
      headers: {
        "X-API-Key": MORALIS_API_KEY || "",
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching assets from treasury:", error);
    return { error: "Error fetching assets from treasury" };
  }
};

export async function GET(req: Request) {
  console.log("[GET][api/fund-token-data]");
  const { searchParams } = new URL(req.url);
  const tokenName = searchParams.get("tokenName");
  if (!tokenName) {
    return NextResponse.json(
      { error: FundTokenDataError.TOKEN_NAME_REQUIRED },
      { status: 400 }
    );
  }

  try {
    console.log("[GET][api/fund-token-data] tokenName", tokenName);
    const jsonDirectory = path.join(process.cwd(), "json");
    const fileContents = await fs.readFile(
      jsonDirectory + "/data.json",
      "utf8"
    );
    const allFundTokenData = JSON.parse(fileContents);
    const tokenData = allFundTokenData[tokenName];

    if (!tokenData) {
      return NextResponse.json(
        { error: FundTokenDataError.FUND_TOKEN_DATA_NOT_FOUND },
        { status: 404 }
      );
    }

    if (tokenData.updatedAt) {
      const lastUpdated = new Date(tokenData.updatedAt);
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago

      if (lastUpdated <= twelveHoursAgo) {
        try {
          const tokenInfo = await getTokenInfo(tokenName);
          const assets = await assetsFromTreasury(tokenInfo.treasuryAddress);
          const colorsHaveBeenUsed = tokenData.assets.map(
            (asset: { color: string }) => asset.color
          );
          const colorPick = setRandomColorToToken(colorsHaveBeenUsed);
          const tokenDataToWriteForFile = {
            name: tokenName,
            description: tokenData.description,
            stats: [
              { label: "Liquidity", value: "$0" },
              { label: "24H Volume", value: "$0" },
              { label: "APR", value: "0%" },
            ], // TODO: get stats from pool
            assets: assets.map(
              (asset: { symbol: string; portfolio_percentage: number }) => ({
                name: asset.symbol,
                percentage: asset.portfolio_percentage,
                color: colorPick,
                fill: colorPick,
              })
            ),
            metrics: [...tokenData.metrics], // TODO: get metrics from pool
            treasuryAddress: tokenInfo.treasuryAddress,
            tokenAddress: tokenInfo.tokenAddress,
            tokenImage: tokenInfo.logo,
            tokenSymbol: tokenInfo.symbol,
            tokenDecimals: tokenInfo.decimals,
            tokenTotalSupply: tokenInfo.total_supply_formatted,
            poolAddress: tokenInfo.poolAddress,
            updatedAt: new Date().toISOString(),
            createdAt: tokenData.createdAt,
          };
          await fs.writeFile(
            jsonDirectory + "/data.json",
            JSON.stringify(tokenDataToWriteForFile, null, 2)
          );
        } catch (error) {
          console.error("Error writing token data to file:", error);
          return { error: "Error writing token data to file" };
        }
      }
    }

    return NextResponse.json(tokenData, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/fund-token-data", error);
    return NextResponse.json(
      { error: FundTokenDataError.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
