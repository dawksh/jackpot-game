"use client"

import '@rainbow-me/rainbowkit/styles.css';
import { frameConnector } from '@/lib/connector';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rabbyWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'
import { http } from 'viem';
import { base } from 'viem/chains';
import { createConfig, WagmiProvider } from 'wagmi';


const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [metaMaskWallet, coinbaseWallet, rabbyWallet, walletConnectWallet],
        },
    ],
    { appName: 'Jackpot Game', projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string },
);

const client = new QueryClient();
export const config = createConfig({
    chains: [base],
    transports: {
        [base.id]: http(),
    },
    connectors: [...connectors, frameConnector()]
});


const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <WagmiProvider config={config}>
                <QueryClientProvider client={client}>
                    <RainbowKitProvider>
                        {children}
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    )
}

export default WalletProvider