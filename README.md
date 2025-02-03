# $JACKPOT Game

## Overview

$JACKPOT is an exciting blockchain-based slot machine game where players can win big prizes in $JACKPOT tokens. Built on the Base network, this game offers a thrilling gambling experience with real-time prize pool updates and seamless wallet integration.

## Features

- Real-time prize pool updates
- Integration with MetaMask and other Web3 wallets
- Tiered system for daily free plays based on $CLANKSTER token holdings
- Ability to purchase additional plays with $JACKPOT tokens
- Responsive design for both desktop and mobile play
- Live token price updates from DexScreener API
- Simplified and gas-optimized claiming process
- How to Play guide accessible within the game interface

## Technical Stack

- React.js for the frontend
- Next.js for server-side rendering and routing
- Web3.js for blockchain interactions
- Tailwind CSS for styling
- DexScreener API for real-time token pricing

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contracts

- $JACKPOT Token: `0x2C8dD0b0604Cc478ada32bEb7bC415e94ED4DE32`
- JackpotGame Contract: `0x6e10E33824FB98C72872bA1D04C4964afe1f919f` (Note: This address will need to be updated after new deployment)
- $CLANKSTER Token: `0x3E1A6D23303bE04403BAdC8bFF348027148Fef27`

## Recent Updates

- Simplified JackpotGame smart contract by removing the approvedAddresses mapping
- Streamlined the prize claiming process
- Implemented gas estimation and optimization for claim transactions
- Updated frontend to reflect new contract structure and claiming process
- Added tiered system for daily free plays based on $CLANKSTER token holdings
- Implemented How to Play guide accessible within the game interface
- Fixed issues with jackpot prize updating and free plays counting
- Updated free play tiers system
- Improved free plays storage and retrieval mechanism to be consistent with purchased plays
- Enhanced daily reset functionality for free plays

## Free Play Tiers

- 1M-9M $CLANKSTER: 1 free play
- 10M-99M $CLANKSTER: 5 free plays
- 100M-249M $CLANKSTER: 10 free plays
- 250M-499M $CLANKSTER: 15 free plays
- 500M-999M $CLANKSTER: 25 free plays
- 1B+ $CLANKSTER: 35 free plays

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

