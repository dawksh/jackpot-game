"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Plus, Minus, HelpCircle } from "lucide-react";
import { JackpotABI } from "./JackpotABI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { base } from "viem/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const JACKPOT_ADDRESS = "0x1b7fE509d6129166a77aE351ce48b531F0946D82";
const CLAIM_CONTRACT_ADDRESS: `0x${string}` =
  "0x1C5AbC7f44ebc6309f88c973424C92daE16926c2";
const CLANKSTER_ADDRESS = "0x3E1A6D23303bE04403BAdC8bFF348027148Fef27";
const PRIZE_WALLET = "0x4793646Fc788c2B06BdDD1b271d8f07b7B1a1504";
const PLAY_COST = 100000;
const GRAND_JACKPOT_SYMBOL = "🎰";
const SYMBOLS: string[] = [
  "🎰",
  "🍌",
  "🍒",
  "🍇",
  "🍍",
  "🍋",
  "🍎",
  "🌶️",
  "🍉",
  "🍐",
  "🥭",
  "🍓",
  "🫐",
  "🍟",
  "🍔",
  "🍬",
  "🎱",
  "🎮",
  "🔫",
  "🎲",
  "🧩",
  "💰",
  "💎",
  "🃏",
  "🏆",
  "🎯",
  "💸",
  "🎁",
  "🎉",
  "🤑",
  "🎠",
  "🔑",
  "🔔",
  "🍀",
  "🎟️",
  "🚀",
  "💣",
];

const SPIN_DURATION = 4000;
const DEX_SCREENER_API_URL =
  "https://api.dexscreener.com/latest/dex/pairs/base/0x1D348c34D0a72789487845311bAc9616ca36Ed7a";

const BASE_NETWORK = {
  chainId: "0x2105",
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

const FREE_PLAY_TIERS = [
  { threshold: 1000000000, plays: 35 },
  { threshold: 500000000, plays: 25 },
  { threshold: 250000000, plays: 15 },
  { threshold: 100000000, plays: 10 },
  { threshold: 10000000, plays: 5 },
  { threshold: 1000000, plays: 1 },
  { threshold: 0, plays: 0 },
];

interface SlotReelProps {
  spinning: boolean;
  symbol: string;
  index: number;
}

const sendPlayTxn = async (address: `0x${string}`) => {
  await axios.post("/api/play", {
    player: address,
  });
};

const SlotReel: React.FC<SlotReelProps> = ({ spinning, symbol, index }) => {
  const reelSymbols = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];
  return (
    <div className="w-24 h-24 border-4 border-yellow-500 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-white" />
      <div className="relative w-full h-full">
        {spinning ? (
          <div
            className="absolute w-full"
            style={{
              animation: `spin${index} ${SPIN_DURATION}ms cubic-bezier(0.1, 0.3, 0.3, 1)`,
              willChange: "transform",
            }}
          >
            {reelSymbols.map((sym, i) => (
              <div
                key={i}
                className="h-24 flex items-center justify-center text-4xl"
              >
                {sym}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {symbol}
          </div>
        )}
      </div>
    </div>
  );
};

const HowToPlayDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="icon">
        <HelpCircle className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>How to Play $JACKPOT</DialogTitle>
        <DialogDescription>
          Learn the rules and mechanics of the $JACKPOT game.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          <strong>Game Rules:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Connect your wallet to start playing.</li>
          <li>Each spin costs 100,000 $JACKPOT tokens.</li>
          <li>
            Match three symbols to win. 🎰🎰🎰 wins the grand
            jackpot!
          </li>
          <li>
            Any other three matching symbols win 10% the jackpot.
          </li>
        </ul>
        <p>
          <strong>Free Plays:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Hold $CLANKSTER tokens to get daily free plays:</li>
          <li>1M-9M: 1 free play</li>
          <li>10M-99M: 5 free plays</li>
          <li>100M-249M: 10 free plays</li>
          <li>250M-499M: 15 free plays</li>
          <li>500M-999M: 25 free plays</li>
          <li>1B+: 35 free plays</li>
        </ul>
        <p>Free plays reset daily. Enjoy responsibly!</p>
        <Link href="/tos" className="text-blue-500 hover:underline">
          Terms of Service
        </Link>
      </div>
    </DialogContent>
  </Dialog>
);

interface PlayerState {
  freePlays: number;
  purchasedPlays: number;
  tokenBalance: string;
  clanksterBalance: string;
}

interface PrizePool {
  usd: number;
  tokens: number;
}

const JackpotGame: React.FC = () => {
  const { address } = useAccount();
  const [prizePool, setPrizePool] = useState<PrizePool>({
    usd: 0,
    tokens: 0,
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const [depositAmount, setDepositAmount] = useState(1);
  const [playerState, setPlayerState] = useState<PlayerState>({
    freePlays: 0,
    purchasedPlays: 0,
    tokenBalance: "0",
    clanksterBalance: "0",
  });
  const [hasWon, setHasWon] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [isMigrated, setIsMigrated] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const { data: allowance, refetch } = useReadContract({
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
          {
            name: "_spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    address: JACKPOT_ADDRESS,
    functionName: "allowance",
    args: [address as `0x${string}`, CLAIM_CONTRACT_ADDRESS],
    query: {
      enabled: !!address,
    },
  });
  const checkAllowance = async (amount: number, user: `0x${string}`) => {
    return Number(allowance) > amount;
  };

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (window) {
      setIsMigrated(Boolean(window.localStorage.getItem("upgrade")));
      setIsCardVisible(
        window.localStorage.getItem("cardVisible") !== "false"
      );
    }
  }, []);

  const getTokenBalance = useCallback(
    async (tokenAddress: string, walletAddress: string) => {
      try {
        const balance = await publicClient.readContract({
          abi: [
            {
              constant: true,
              inputs: [{ name: "_owner", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "balance", type: "uint256" }],
              type: "function",
            },
          ] as const,
          address: tokenAddress as `0x${string}`,
          functionName: "balanceOf",
        });
        return formatUnits(balance as any, 18);
      } catch (error) {
        console.error(
          `Failed to get balance for token ${tokenAddress}:`,
          error
        );
        return "0";
      }
    },
    []
  );

  const fetchTokenPrice = useCallback(async () => {
    try {
      const response = await fetch(DEX_SCREENER_API_URL);
      const data = await response.json();
      const price = Number.parseFloat(data.pair.priceUsd);
      setTokenPrice(price);
    } catch (error) {
      console.error("Failed to fetch token price:", error);
    }
  }, []);

  const getJackpotPrize = useCallback(async () => {
    try {
      const prizeWalletBalance = await publicClient.readContract({
        abi: JackpotABI,
        address: CLAIM_CONTRACT_ADDRESS,
        functionName: "getPrizePoolBalance",
      });

      const tokensAmount = Number.parseFloat(
        formatUnits(prizeWalletBalance as any, 18).toString()
      );
      const usdValue = tokensAmount * tokenPrice;

      setPrizePool({
        tokens: Math.round(tokensAmount),
        usd: usdValue,
      });
    } catch (error) {
      console.error("Failed to get prize pool:", error);
      setPrizePool({ tokens: 0, usd: 0 });
    }
  }, [tokenPrice]);

  const claimPrize = async () => {
    if (!address || !hasWon) return;
    try {
      setMessage("Preparing to claim prize...");
      const amountInWei = parseUnits(winAmount.toString(), 18);
      console.log(
        "Attempting to claim prize amount (in Wei):",
        amountInWei
      );

      setMessage("Sending claim transaction...");

      const {
        data: { signature },
      } = await axios.get("/api/signature", {
        params: {
          amount: amountInWei.toString(),
          winner: address,
        },
      });

      const tx = await writeContractAsync({
        abi: JackpotABI,
        address: CLAIM_CONTRACT_ADDRESS,
        functionName: "claim",
        args: [signature, amountInWei],
      });

      console.log("Transaction result:", tx);

      if (tx) {
        setHasWon(false);
        setWinAmount(0);
        setMessage("Prize claimed successfully!");
        await getPlayerBalances(address);
        await getJackpotPrize();
      } else {
        throw new Error("Prize claim transaction failed");
      }
    } catch (error: any) {
      console.error("Failed to claim prize:", error);
      const errorMessage =
        error.code === 4001
          ? "Transaction was cancelled"
          : error.message || "Unknown error";
      setMessage(`Failed to claim prize: ${errorMessage}`);
      console.log("Full error object:", JSON.stringify(error, null, 2));
    }
  };

  const getPlayerBalances = useCallback(
    async (address: string) => {
      if (!address) return;
      try {
        const [jackpotBalance, clanksterBalance] = await Promise.all([
          getTokenBalance(JACKPOT_ADDRESS, address),
          getTokenBalance(CLANKSTER_ADDRESS, address),
        ]);
        setPlayerState((prev) => ({
          ...prev,
          tokenBalance: jackpotBalance,
          clanksterBalance: clanksterBalance,
        }));
        await updateFreePlays(address, clanksterBalance);
      } catch (error) {
        console.error("Failed to get balances:", error);
        setPlayerState((prev) => ({
          ...prev,
          tokenBalance: "0",
          clanksterBalance: "0",
        }));
        await updateFreePlays(address, "0");
      }
    },
    [getTokenBalance]
  );

  const updateFreePlays = async (
    address: string,
    clanksterBalance: string
  ) => {
    const balanceInMillions = Math.floor(
      Number(clanksterBalance) / 1000000
    );
    const tier = FREE_PLAY_TIERS.find(
      (tier) => balanceInMillions >= tier.threshold / 1000000
    );
    const calculatedFreePlays = tier ? tier.plays : 0;

    const lastResetTime = getLastResetTime(address);
    const currentTime = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    let storedFreePlays = getStoredFreePlays(address);

    if (currentTime - lastResetTime >= oneDayInMs) {
      storedFreePlays = calculatedFreePlays;
      updateLastResetTime(address);
    }

    setPlayerState((prev) => ({ ...prev, freePlays: storedFreePlays }));
    updateStoredFreePlays(address, storedFreePlays);
    console.log(`Updated free plays for ${address}: ${storedFreePlays}`);
  };

  const deposit = async () => {
    if (!address) return;
    if (depositAmount > 10) {
      setMessage("Cannot deposit for more than 10 plays.");
      return;
    }
    const isAllowed = await checkAllowance(
      PLAY_COST * depositAmount * 10 ** 18,
      address
    );
    try {
      if (!isAllowed) {
        const tx = await writeContractAsync({
          abi: [
            {
              constant: true,
              inputs: [
                {
                  name: "spender",
                  type: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [
                {
                  name: "",
                  type: "uint256",
                },
              ],
              payable: false,
              stateMutability: "view",
              type: "function",
            },
          ] as const,
          address: JACKPOT_ADDRESS,
          args: [CLAIM_CONTRACT_ADDRESS, 100 * PLAY_COST * 10 ** 18],
          functionName: "approve",
        });
      }
      const txHash = await writeContractAsync({
        abi: JackpotABI,
        address: CLAIM_CONTRACT_ADDRESS,
        functionName: "deposit",
        args: [depositAmount],
      });

      await getPlayerBalances(address);
      await getJackpotPrize();
      const newPurchasedPlays =
        playerState.purchasedPlays + depositAmount;
      setPlayerState((prev) => ({
        ...prev,
        purchasedPlays: newPurchasedPlays,
      }));
      updateStoredPlays(address, newPurchasedPlays);
      console.log(
        `Deposit successful. New purchased plays: ${newPurchasedPlays}`
      );
      setMessage("Deposit successful! Your balance has been updated.");
    } catch (error) {
      console.error("Deposit failed:", error);
      setMessage("Deposit failed. Please try again.");
    }
  };

  const migrateContract = async () => {
    if (isMigrated) {
      return;
    }

    await writeContractAsync({
      abi: JackpotABI,
      address: CLAIM_CONTRACT_ADDRESS,
      functionName: "updateContract",
    });

    localStorage.setItem("upgrade", "true");
  };

  const play = async () => {
    if (
      !address ||
      isSpinning ||
      (playerState.purchasedPlays === 0 && playerState.freePlays === 0)
    )
      return;
    try {
      const storedPlays = await getStoredPlays(address);
      const storedFreePlays = getStoredFreePlays(address);
      setPlayerState((prev) => ({
        ...prev,
        purchasedPlays: storedPlays,
        freePlays: storedFreePlays,
      }));
      setIsSpinning(true);
      setMessage("");

      if (playerState.purchasedPlays != 0) await sendPlayTxn(address);

      let spinning = true;

      const spinInterval = setInterval(() => {
        if (spinning) {
          setReels(
            Array(3)
              .fill("")
              .map(
                () =>
                  SYMBOLS[
                  Math.floor(
                    Math.random() * SYMBOLS.length
                  )
                  ]
              )
          );
        }
      }, 50);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinning = false;
      clearInterval(spinInterval);

      const finalReels = Array(3)
        .fill("")
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

      setReels(finalReels);

      const isGrandJackpot = finalReels.every(
        (symbol) => symbol === GRAND_JACKPOT_SYMBOL
      );
      const isJackpot =
        finalReels[0] === finalReels[1] &&
        finalReels[1] === finalReels[2];

      if (isGrandJackpot) {
        setWinAmount(prizePool.tokens);
        setHasWon(true);
        setMessage("Congratulations! You won the Grand Jackpot!");
      } else if (isJackpot) {
        setWinAmount(Math.floor(prizePool.tokens * 0.1));
        setHasWon(true);
        setMessage("Congratulations! You won the Jackpot!");
      } else {
        setHasWon(false);
        setWinAmount(0);
        setMessage("");
      }

      setPlayerState((prev) => {
        let newPurchasedPlays = prev.purchasedPlays;
        let newFreePlays = prev.freePlays;

        if (prev.freePlays > 0) {
          newFreePlays -= 1;
        } else if (prev.purchasedPlays > 0) {
          newPurchasedPlays -= 1;
        }

        updateStoredPlays(address, newPurchasedPlays);
        updateStoredFreePlays(address, newFreePlays);

        console.log(
          `Play completed. New free plays: ${newFreePlays}, New purchased plays: ${newPurchasedPlays}`
        );

        return {
          ...prev,
          purchasedPlays: newPurchasedPlays,
          freePlays: newFreePlays,
        };
      });
      setIsSpinning(false);
    } catch (error) {
      console.error("Play failed:", error);
      setIsSpinning(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPrizeAndPrice = async () => {
      await fetchTokenPrice();
      await getJackpotPrize();
    };

    fetchPrizeAndPrice();
    const intervalId = setInterval(fetchPrizeAndPrice, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [fetchTokenPrice, getJackpotPrize]);

  useEffect(() => {
    if (address) {
      getPlayerBalances(address);
    }
  }, [address, getPlayerBalances]);

  useEffect(() => {
    const checkDailyReset = () => {
      if (address) {
        const lastResetTime = getLastResetTime(address);
        const currentTime = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        if (currentTime - lastResetTime >= oneDayInMs) {
          getPlayerBalances(address);
        }
      }
    };

    checkDailyReset();
    const intervalId = setInterval(checkDailyReset, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [address, getPlayerBalances]);

  const formatNumber = (num: number | string): string => {
    return Math.floor(Number.parseFloat(num.toString())).toLocaleString();
  };

  const handleDepositInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setDepositAmount(value);
    }
  };

  const getStoredPlays = async (address: string): Promise<number> => {
    const plays = await publicClient.readContract({
      abi: JackpotABI,
      address: CLAIM_CONTRACT_ADDRESS,
      functionName: "playsLeft",
      args: [address],
    });
    return Number(plays);
  };

  const updateStoredPlays = (address: string, plays: number) => {
    localStorage.setItem(`purchasedPlays_${address}`, plays.toString());
  };

  const getStoredFreePlays = (address: string): number => {
    const storedFreePlays = localStorage.getItem(`freePlays_${address}`);
    return storedFreePlays ? Number.parseInt(storedFreePlays, 10) : 0;
  };

  const updateStoredFreePlays = (address: string, plays: number) => {
    localStorage.setItem(`freePlays_${address}`, plays.toString());
  };

  const getLastResetTime = (address: string): number => {
    const lastResetTime = localStorage.getItem(`lastResetTime_${address}`);
    return lastResetTime ? Number.parseInt(lastResetTime, 10) : 0;
  };

  const updateLastResetTime = (address: string) => {
    localStorage.setItem(`lastResetTime_${address}`, Date.now().toString());
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <style jsx global>{`
				@keyframes spin0 {
					0% {
						transform: translateY(0);
					}
					100% {
						transform: translateY(-${SYMBOLS.length * 96}px);
					}
				}
				@keyframes spin1 {
					0% {
						transform: translateY(-96px);
					}
					100% {
						transform: translateY(-${(SYMBOLS.length + 1) * 96}px);
					}
				}
				@keyframes spin2 {
					0% {
						transform: translateY(-192px);
					}
					100% {
						transform: translateY(-${(SYMBOLS.length + 2) * 96}px);
					}
				}
			`}</style>

      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jackpot-logocopy-7Ab1kjmShTzXGKQm2IypLN0AymGiF4.png"
              alt="Jackpot Logo"
              className="w-48 mx-auto mb-6"
            />
            <div className="text-4xl font-bold mb-2">
              ${formatNumber(prizePool.usd.toFixed(2))}
            </div>
            <div className="text-xl">
              {formatNumber(prizePool.tokens)} $JACKPOT
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <Card className="bg-blue-100 border-blue-300">
          <CardContent className="p-4">
            <p className="text-blue-800">{message}</p>
          </CardContent>
        </Card>
      )}

      {isCardVisible && (
        <Card className="bg-blue-100 border-blue-300">
          <CardContent className="p-4 flex justify-between items-center">
            <p className="text-blue-800">
              Note: To use your free plays, you must first deposit
              for at least one paid spin.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("cardVisible", "false");
                setIsCardVisible(false);
              }}
              className="text-blue-800 hover:text-blue-900"
            >
              ×
            </button>
          </CardContent>
        </Card>
      )}
      {!isMigrated && (
        <Card className="bg-blue-100 border-blue-300">
          <CardContent className="p-4 flex justify-between items-center">
            <p className="text-blue-800">
              We recently upgraded our contracts, please click the
              button below to migrate
            </p>
            <div className="flex gap-2 items-center">
              <Button onClick={migrateContract}>Migrate</Button>
              <button
                onClick={() => {
                  localStorage.setItem("upgrade", "true");
                  setIsMigrated(true);
                }}
                className="text-blue-800 hover:text-blue-900"
              >
                ×
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-b from-gray-900 to-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <HowToPlayDialog />
          </div>
          <div className="flex justify-center gap-4 mb-6">
            {reels.map((symbol, index) => (
              <SlotReel
                key={index}
                spinning={isSpinning}
                symbol={symbol}
                index={index}
              />
            ))}
          </div>

          <Button
            onClick={play}
            disabled={!address || isSpinning}
            className="w-full h-16 text-xl"
          >
            <Play className="w-6 h-6 mr-2" />
            {isSpinning ? "Spinning..." : "SPIN!"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!address ? (
              <div className="flex justify-center items-center">
                <ConnectButton />
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Connected Address:</span>
                  <span className="font-mono text-sm">
                    {address.slice(0, 6)}...
                    {address.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jackpot Balance:</span>
                  <span className="font-bold">
                    {formatNumber(playerState.tokenBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Clankster Balance:</span>
                  <span className="font-bold">
                    {formatNumber(
                      playerState.clanksterBalance
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Free Plays:</span>
                  <span className="font-bold">
                    {playerState.freePlays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Purchased Plays:</span>
                  <span className="font-bold">
                    {playerState.purchasedPlays}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-4">
                  <Button
                    onClick={() =>
                      setDepositAmount((prev) =>
                        Math.max(1, prev - 1)
                      )
                    }
                    variant="outline"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={handleDepositInputChange}
                    className="text-center"
                    min="1"
                  />
                  <Button
                    onClick={() =>
                      setDepositAmount((prev) => prev + 1)
                    }
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {formatNumber(PLAY_COST * depositAmount)}{" "}
                  $JACKPOT
                </div>

                <Button
                  onClick={deposit}
                  className="w-full"
                  disabled={!address}
                >
                  Deposit for {depositAmount} Play
                  {depositAmount !== 1 ? "s" : ""}
                </Button>

                {hasWon && (
                  <Button
                    onClick={claimPrize}
                    className="w-full bg-green-500 text-white hover:bg-green-600"
                  >
                    Claim {formatNumber(winAmount)} $JACKPOT
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JackpotGame;
