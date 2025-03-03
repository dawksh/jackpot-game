"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createConfig, http, WagmiProvider } from "wagmi"
import JackpotGame from "../jackpot-game"
import { base } from "viem/chains"
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'Jackpot Game',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [base],
  ssr: false,
});

const client = new QueryClient();
// export const config = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http(),
//   },
// });

export default function SyntheticV0PageForDeployment() {
  // return (
  //   <div className={`flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-900 text-white ${inter.className}`}>
  //     <h1 className={`text-4xl font-bold mb-4 ${montserrat.className} text-blue-400`}>Under Maintenance</h1>
  //     <p className="text-xl mb-8 text-gray-200">We're currently performing some updates to improve your experience.</p>
  //     <div className="flex flex-col gap-4">
  //       <p className="text-gray-300">We'll be back soon!</p>
  //       <p className="text-sm text-gray-400">Thank you for your patience.</p>
  //     </div>
  //   </div>
  // )
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <JackpotGame />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}