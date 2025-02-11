"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, Play, Plus, Minus, HelpCircle } from "lucide-react"
import { JackpotABI } from "./JackpotABI"
import { privateKeyToAccount } from "viem/accounts"
import Web3 from "web3"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createWalletClient, getContract, http } from "viem"
import { base } from "viem/chains"

declare global {
  interface Window {
    ethereum?: any
  }
}

const web3 = new Web3(new Web3.providers.HttpProvider("https://base.drpc.org"))

const JACKPOT_ADDRESS = "0x1b7fE509d6129166a77aE351ce48b531F0946D82"
const CLAIM_CONTRACT_ADDRESS: `0x${string}` = "0xcb8F593526Ef882a153CfD80D17DbBB9576CcF7c"
const CLANKSTER_ADDRESS = "3E1A6D23303bE04403BAdC8bFF348027148Fef27"
const PRIZE_WALLET = "0xBafF4708D94D3677E6823397596c9AC40919e0aE"
const PLAY_COST = 100000
const GRAND_JACKPOT_SYMBOL = "🎰"
const SYMBOLS = [
  "🍒",
  "🍋",
  "🍊",
  "🍇",
  "🍓",
  "🍑",
  "🍍",
  "🥝",
  "🍎",
  "🎲",
  "♠️",
  "♥️",
  "🃏",
  "🧩",
  "♟",
  "♣️",
  "♦️",
  "🎮",
  "🕹",
  "👾",
]
const SPIN_DURATION = 4000
const DEX_SCREENER_API_URL =
  "https://api.dexscreener.com/latest/dex/pairs/base/0x1D348c34D0a72789487845311bAc9616ca36Ed7a"

const BASE_NETWORK = {
  chainId: "0x2105",
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
}

const FREE_PLAY_TIERS = [
  { threshold: 1000000000, plays: 35 },
  { threshold: 500000000, plays: 25 },
  { threshold: 250000000, plays: 15 },
  { threshold: 100000000, plays: 10 },
  { threshold: 10000000, plays: 5 },
  { threshold: 1000000, plays: 1 },
  { threshold: 0, plays: 0 },
]

interface SlotReelProps {
  spinning: boolean
  symbol: string
  index: number
}

const sendPlayTxn = async (address: `0x${string}`) => {
  const account = privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`)
  const wallet = createWalletClient({
    account,
    chain: base,
    transport: http()
  })
  const contract = getContract({ abi: JackpotABI, address: CLAIM_CONTRACT_ADDRESS, client: { wallet } })
  await contract.write.play([address])
}

const genSig = async (amount: BigInt, winner: string) => {
  const chainId = 8453;
  const domainName = 'JackpotGameStore';
  const domainVersion = '1';

  const account = privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`)

  const client = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  const domain = {
    name: domainName,
    version: domainVersion,
    chainId,
    verifyingContract: CLAIM_CONTRACT_ADDRESS,
  };

  const types = {
    claim: [
      { name: 'winner', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  };

  const message = {
    winner: winner || account.address,
    amount,
  };

  const signature = await client.signTypedData({
    domain,
    types,
    primaryType: 'claim',
    message,
  });

  return signature
}

const checkAllowance = async (amount: number, user: `0x${string}`) => {
  const contract = new web3.eth.Contract(
    [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          },
          {
            "name": "_spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ],
    JACKPOT_ADDRESS,
  )

  const allowance = await contract.methods.allowance(user, CLAIM_CONTRACT_ADDRESS).call()
  return Number(allowance) > amount
}

const SlotReel: React.FC<SlotReelProps> = ({ spinning, symbol, index }) => {
  const reelSymbols = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS]
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
              <div key={i} className="h-24 flex items-center justify-center text-4xl">
                {sym}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{symbol}</div>
        )}
      </div>
    </div>
  )
}

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
        <DialogDescription>Learn the rules and mechanics of the $JACKPOT game.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          <strong>Game Rules:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Connect your wallet to start playing.</li>
          <li>Each spin costs 100,000 $JACKPOT tokens.</li>
          <li>Match three symbols to win. 🎰🎰🎰 wins the grand jackpot!</li>
          <li>Any other three matching symbols win 10% the jackpot.</li>
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
      </div>
    </DialogContent>
  </Dialog>
)

interface PlayerState {
  freePlays: number
  purchasedPlays: number
  tokenBalance: string
  clanksterBalance: string
}

interface PrizePool {
  usd: number
  tokens: number
}

const JackpotGame: React.FC = () => {
  const [account, setAccount] = useState<`0x${string}` | null>(null)
  const [prizePool, setPrizePool] = useState<PrizePool>({ usd: 0, tokens: 0 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [reels, setReels] = useState(["🎰", "🎰", "🎰"])
  const [depositAmount, setDepositAmount] = useState(1)
  const [playerState, setPlayerState] = useState<PlayerState>({
    freePlays: 0,
    purchasedPlays: 0,
    tokenBalance: "0",
    clanksterBalance: "0",
  })
  const [hasWon, setHasWon] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [message, setMessage] = useState("")
  const [tokenPrice, setTokenPrice] = useState(0)

  const getTokenBalance = useCallback(async (tokenAddress: string, walletAddress: string) => {
    try {
      const contract = new web3.eth.Contract(
        [
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
        ],
        tokenAddress,
      )

      const balance = await contract.methods.balanceOf(walletAddress).call()
      return web3.utils.fromWei(Number(balance), "ether")
    } catch (error) {
      console.error(`Failed to get balance for token ${tokenAddress}:`, error)
      return "0"
    }
  }, [])

  const fetchTokenPrice = useCallback(async () => {
    try {
      const response = await fetch(DEX_SCREENER_API_URL)
      const data = await response.json()
      const price = Number.parseFloat(data.pair.priceUsd)
      setTokenPrice(price)
    } catch (error) {
      console.error("Failed to fetch token price:", error)
    }
  }, [])

  const getJackpotPrize = useCallback(async () => {
    try {
      const contract = new web3.eth.Contract(JackpotABI, CLAIM_CONTRACT_ADDRESS)
      const prizeWalletBalance = await contract.methods.getPrizePoolBalance().call()

      const tokensAmount = Number.parseFloat(web3.utils.fromWei(Number(prizeWalletBalance), "ether"))
      const usdValue = tokensAmount * tokenPrice

      setPrizePool({
        tokens: Math.round(tokensAmount),
        usd: usdValue,
      })
    } catch (error) {
      console.error("Failed to get prize pool:", error)
      setPrizePool({ tokens: 0, usd: 0 })
    }
  }, [tokenPrice])

  const claimPrize = async () => {
    if (!account || !hasWon) return
    try {
      const contract = new web3.eth.Contract(JackpotABI, CLAIM_CONTRACT_ADDRESS)
      setMessage("Preparing to claim prize...")

      const amountInWei = web3.utils.toWei(winAmount.toString(), "ether")
      console.log("Attempting to claim prize amount (in Wei):", amountInWei)

      setMessage("Sending claim transaction...")

      const sig = await genSig(BigInt(amountInWei), account);

      const { data } = contract.methods.claim(sig, BigInt(amountInWei)).populateTransaction({
        from: account
      })

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: CLAIM_CONTRACT_ADDRESS,
            data,
          },
        ],
      })

      let receipt = null
      while (!receipt) {
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [tx],
        })
        if (!receipt) await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      console.log("Transaction result:", tx)

      if (receipt) {
        setHasWon(false)
        setWinAmount(0)
        setMessage("Prize claimed successfully!")
        await getPlayerBalances(account)
        await getJackpotPrize()
      } else {
        throw new Error("Prize claim transaction failed")
      }
    } catch (error: any) {
      console.error("Failed to claim prize:", error)
      const errorMessage = error.code === 4001 ? "Transaction was cancelled" : error.message || "Unknown error"
      setMessage(`Failed to claim prize: ${errorMessage}`)
      console.log("Full error object:", JSON.stringify(error, null, 2))
    }
  }

  const getPlayerBalances = useCallback(
    async (address: string) => {
      if (!address) return
      try {
        const [jackpotBalance, clanksterBalance] = await Promise.all([
          getTokenBalance(JACKPOT_ADDRESS, address),
          getTokenBalance(CLANKSTER_ADDRESS, address),
        ])
        setPlayerState((prev) => ({
          ...prev,
          tokenBalance: jackpotBalance,
          clanksterBalance: clanksterBalance,
        }))
        await updateFreePlays(address, clanksterBalance)
      } catch (error) {
        console.error("Failed to get balances:", error)
        setPlayerState((prev) => ({
          ...prev,
          tokenBalance: "0",
          clanksterBalance: "0",
        }))
        await updateFreePlays(address, "0")
      }
    },
    [getTokenBalance],
  )

  const updateFreePlays = async (address: string, clanksterBalance: string) => {
    const balanceInMillions = Math.floor(Number(clanksterBalance) / 1000000)
    const tier = FREE_PLAY_TIERS.find((tier) => balanceInMillions >= tier.threshold / 1000000)
    const calculatedFreePlays = tier ? tier.plays : 0

    const lastResetTime = getLastResetTime(address)
    const currentTime = Date.now()
    const oneDayInMs = 24 * 60 * 60 * 1000

    let storedFreePlays = getStoredFreePlays(address)

    if (currentTime - lastResetTime >= oneDayInMs) {
      storedFreePlays = calculatedFreePlays
      updateLastResetTime(address)
    }

    setPlayerState((prev) => ({ ...prev, freePlays: storedFreePlays }))
    updateStoredFreePlays(address, storedFreePlays)
    console.log(`Updated free plays for ${address}: ${storedFreePlays}`)
  }

  const connectWallet = async () => {
    if (!window.ethereum) return
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (chainId !== BASE_NETWORK.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BASE_NETWORK],
          })
        } catch (error) {
          console.error("Failed to switch network:", error)
          alert("Please switch to the Base network to play.")
          return
        }
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const connectedAccount = accounts[0]
      setAccount(connectedAccount)
      window.ethereum.on("accountsChanged", handleAccountChange)

      const storedPlays = await getStoredPlays(connectedAccount)
      const storedFreePlays = getStoredFreePlays(connectedAccount)
      setPlayerState((prev) => ({
        ...prev,
        purchasedPlays: storedPlays,
        freePlays: storedFreePlays,
      }))
      await getPlayerBalances(connectedAccount)
      console.log(`Connected wallet: ${connectedAccount}. Stored plays: ${storedPlays}, Free plays: ${storedFreePlays}`)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    if (account) {
      updateStoredPlays(account, playerState.purchasedPlays)
      updateStoredFreePlays(account, playerState.freePlays)
      console.log(
        `Disconnecting wallet: ${account}. Storing plays: ${playerState.purchasedPlays}, Free plays: ${playerState.freePlays}`,
      )
    }
    setAccount(null)
    setPlayerState({
      freePlays: 0,
      purchasedPlays: 0,
      tokenBalance: "0",
      clanksterBalance: "0",
    })
    window.ethereum?.removeListener("accountsChanged", handleAccountChange)
  }

  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0] as any)
    } else {
      disconnectWallet()
    }
  }

  const deposit = async () => {
    if (!account) return
    if (depositAmount > 10) {
      setMessage("Cannot deposit for more than 10 plays.")
      return
    }
    const isAllowed = await checkAllowance(PLAY_COST * depositAmount * (10 ** 18), account)
    try {
      if (!isAllowed) {
        const contract = new web3.eth.Contract(
          [
            {
              "constant": true,
              "inputs": [
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            }
          ],
          JACKPOT_ADDRESS,
        )
        const { data } = contract.methods.approve(CLAIM_CONTRACT_ADDRESS, 100 * PLAY_COST * (10 ** 18)).populateTransaction({
          from: account
        })
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: JACKPOT_ADDRESS,
              data
            },
          ],
        })
        let receipt = null
        while (!receipt) {
          receipt = await window.ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          })
          if (!receipt) await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: CLAIM_CONTRACT_ADDRESS,
            data: `0xb6b55f25${depositAmount.toString().padStart(64, "0")}`,
          },
        ],
      })

      let receipt = null
      while (!receipt) {
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        })
        if (!receipt) await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      await getPlayerBalances(account)
      await getJackpotPrize()
      const newPurchasedPlays = playerState.purchasedPlays + depositAmount
      setPlayerState((prev) => ({
        ...prev,
        purchasedPlays: newPurchasedPlays,
      }))
      updateStoredPlays(account, newPurchasedPlays)
      console.log(`Deposit successful. New purchased plays: ${newPurchasedPlays}`)
      setMessage("Deposit successful! Your balance has been updated.")
    } catch (error) {
      console.error("Deposit failed:", error)
      setMessage("Deposit failed. Please try again.")
    }
  }

  const play = async () => {
    if (!account || isSpinning || (playerState.purchasedPlays === 0 && playerState.freePlays === 0)) return
    try {
      const storedPlays = await getStoredPlays(account)
      const storedFreePlays = getStoredFreePlays(account)
      setPlayerState((prev) => ({
        ...prev,
        purchasedPlays: storedPlays,
        freePlays: storedFreePlays,
      }))
      setIsSpinning(true)
      setMessage("")
      await sendPlayTxn(account)

      let spinning = true
      const spinInterval = setInterval(() => {
        if (spinning) {
          setReels(
            Array(3)
              .fill("")
              .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]),
          )
        }
      }, 50)

      await new Promise((resolve) => setTimeout(resolve, 2000))
      spinning = false
      clearInterval(spinInterval)

      const finalReels = Array(3)
        .fill("")
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      setReels(finalReels)

      const isGrandJackpot = finalReels.every((symbol) => symbol === GRAND_JACKPOT_SYMBOL)
      const isJackpot = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]

      if (isGrandJackpot) {
        setWinAmount(prizePool.tokens)
        setHasWon(true)
        setMessage("Congratulations! You won the Grand Jackpot!")
      } else if (isJackpot) {
        setWinAmount(Math.floor(prizePool.tokens * 0.1))
        setHasWon(true)
        setMessage("Congratulations! You won the Jackpot!")
      } else {
        setHasWon(false)
        setWinAmount(0)
        setMessage("")
      }

      setPlayerState((prev) => {
        let newPurchasedPlays = prev.purchasedPlays
        let newFreePlays = prev.freePlays

        if (prev.freePlays > 0) {
          newFreePlays -= 1
        } else if (prev.purchasedPlays > 0) {
          newPurchasedPlays -= 1
        }

        updateStoredPlays(account, newPurchasedPlays)
        updateStoredFreePlays(account, newFreePlays)

        console.log(`Play completed. New free plays: ${newFreePlays}, New purchased plays: ${newPurchasedPlays}`)

        return {
          ...prev,
          purchasedPlays: newPurchasedPlays,
          freePlays: newFreePlays,
        }
      })
      setIsSpinning(false)
    } catch (error) {
      console.error("Play failed:", error)
      setIsSpinning(false)
      setMessage("An error occurred. Please try again.")
    }
  }

  useEffect(() => {
    const fetchPrizeAndPrice = async () => {
      await fetchTokenPrice()
      await getJackpotPrize()
    }

    fetchPrizeAndPrice()
    const intervalId = setInterval(fetchPrizeAndPrice, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [fetchTokenPrice, getJackpotPrize])

  useEffect(() => {
    if (account) {
      getPlayerBalances(account)
    }
  }, [account, getPlayerBalances])

  useEffect(() => {
    const checkDailyReset = () => {
      if (account) {
        const lastResetTime = getLastResetTime(account)
        const currentTime = Date.now()
        const oneDayInMs = 24 * 60 * 60 * 1000

        if (currentTime - lastResetTime >= oneDayInMs) {
          getPlayerBalances(account)
        }
      }
    }

    checkDailyReset()
    const intervalId = setInterval(checkDailyReset, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [account, getPlayerBalances])

  const formatNumber = (num: number | string): string => {
    return Math.floor(Number.parseFloat(num.toString())).toLocaleString()
  }

  const handleDepositInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1) {
      setDepositAmount(value)
    }
  }

  const getStoredPlays = async (address: string): Promise<number> => {
    const contract = new web3.eth.Contract(JackpotABI, CLAIM_CONTRACT_ADDRESS)
    const plays = await contract.methods.playsLeft(address).call();
    console.log(plays)
    return Number(plays);
  }

  const updateStoredPlays = (address: string, plays: number) => {
    localStorage.setItem(`purchasedPlays_${address}`, plays.toString())
  }

  const getStoredFreePlays = (address: string): number => {
    const storedFreePlays = localStorage.getItem(`freePlays_${address}`)
    return storedFreePlays ? Number.parseInt(storedFreePlays, 10) : 0
  }

  const updateStoredFreePlays = (address: string, plays: number) => {
    localStorage.setItem(`freePlays_${address}`, plays.toString())
  }

  const getLastResetTime = (address: string): number => {
    const lastResetTime = localStorage.getItem(`lastResetTime_${address}`)
    return lastResetTime ? Number.parseInt(lastResetTime, 10) : 0
  }

  const updateLastResetTime = (address: string) => {
    localStorage.setItem(`lastResetTime_${address}`, Date.now().toString())
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <style jsx global>{`
      @keyframes spin0 {
        0% { transform: translateY(0); }
        100% { transform: translateY(-${SYMBOLS.length * 96}px); }
      }
      @keyframes spin1 {
        0% { transform: translateY(-96px); }
        100% { transform: translateY(-${(SYMBOLS.length + 1) * 96}px); }
      }
      @keyframes spin2 {
        0% { transform: translateY(-192px); }
        100% { transform: translateY(-${(SYMBOLS.length + 2) * 96}px); }
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
            <div className="text-4xl font-bold mb-2">${formatNumber(prizePool.usd.toFixed(2))}</div>
            <div className="text-xl">{formatNumber(prizePool.tokens)} $JACKPOT</div>
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

      <Card className="bg-gradient-to-b from-gray-900 to-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <HowToPlayDialog />
          </div>
          <div className="flex justify-center gap-4 mb-6">
            {reels.map((symbol, index) => (
              <SlotReel key={index} spinning={isSpinning} symbol={symbol} index={index} />
            ))}
          </div>

          <Button onClick={play} disabled={!account || isSpinning} className="w-full h-16 text-xl">
            <Play className="w-6 h-6 mr-2" />
            {isSpinning ? "Spinning..." : "SPIN!"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!account ? (
              <Button onClick={connectWallet} className="w-full flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Connected Address:</span>
                  <span className="font-mono text-sm">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jackpot Balance:</span>
                  <span className="font-bold">{formatNumber(playerState.tokenBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clankster Balance:</span>
                  <span className="font-bold">{formatNumber(playerState.clanksterBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Plays:</span>
                  <span className="font-bold">{playerState.freePlays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Purchased Plays:</span>
                  <span className="font-bold">{playerState.purchasedPlays}</span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-4">
                  <Button onClick={() => setDepositAmount((prev) => Math.max(1, prev - 1))} variant="outline">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={handleDepositInputChange}
                    className="text-center"
                    min="1"
                  />
                  <Button onClick={() => setDepositAmount((prev) => prev + 1)} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {formatNumber(PLAY_COST * depositAmount)} $JACKPOT
                </div>

                <Button onClick={deposit} className="w-full" disabled={!account}>
                  Deposit for {depositAmount} Play{depositAmount !== 1 ? "s" : ""}
                </Button>

                {hasWon && (
                  <Button onClick={claimPrize} className="w-full bg-green-500 text-white hover:bg-green-600">
                    Claim {formatNumber(winAmount)} $JACKPOT
                  </Button>
                )}
                <Button
                  onClick={disconnectWallet}
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Disconnect Wallet
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default JackpotGame
