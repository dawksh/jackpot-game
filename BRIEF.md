# $JACKPOT Game Brief

## For Players (Non-Technical Description)

Welcome to $JACKPOT, the most exciting slot machine game on the Base blockchain! 

Here's what you need to know:

1. **How to Play**: Connect your Web3 wallet (like MetaMask) to start playing. You might have free plays available if you hold $CLANKSTER tokens!

2. **The Prize**: The jackpot grows in real-time! Watch as the prize pool increases with each play.

3. **Winning**: Match three symbols to win. If you hit the jackpot (🎰🎰🎰), you win the entire prize pool!

4. **Tokens**: The game uses $JACKPOT tokens. You can buy more plays directly in the game.

5. **Daily Free Plays**: Hold $CLANKSTER tokens to get daily free plays:
   - 1M-9M: 1 free play
   - 10M-99M: 5 free plays
   - 100M-249M: 10 free plays
   - 250M-499M: 15 free plays
   - 500M-999M: 25 free plays
   - 1B+: 35 free plays

6. **Claiming Prizes**: If you win, you can claim your prize directly through the game interface. No additional approvals needed!

7. **How to Play Guide**: Look for the "?" button in the game interface for a quick guide on how to play and understand the rules.

Remember, while gambling can be fun, always play responsibly and within your means.

## For Developers (Technical Description)

$JACKPOT is a Web3-enabled slot machine game built on the Base network. Key technical aspects include:

1. **Frontend**: Built with React and Next.js, utilizing Tailwind CSS for responsive design.

2. **Blockchain Interaction**: Uses Web3.js to interact with smart contracts on the Base network.

3. **Smart Contracts**: 
   - $JACKPOT Token: `0x2C8dD0b0604Cc478ada32bEb7bC415e94ED4DE32`
   - Claim Contract (JackpotGame): `0x6e10E33824FB98C72872bA1D04C4964afe1f919f` (Note: This address will need to be updated after new deployment)
   - $CLANKSTER Token: `0x3E1A6D23303bE04403BAdC8bFF348027148Fef27`

4. **Real-time Updates**: Fetches live token prices from the DexScreener API and updates the prize pool in real-time.

5. **State Management**: Uses React hooks for local state management.

6. **Wallet Integration**: Supports MetaMask and other Web3 wallets for transactions and account management.

7. **Game Logic**: Implements a random number generation for slot spins (Note: This should be moved to a verifiable on-chain function in production).

8. **Token Economics**: Integrates $JACKPOT for gameplay and $CLANKSTER for daily free plays.

9. **Smart Contract Simplification**: The JackpotGame contract has been simplified to remove the approvedAddresses mapping, streamlining the claim process.

10. **Gas Optimization**: Implements gas estimation and adjusts gas limit for claim transactions to ensure smooth operation.

11. **Free Play Tiers**: Implements a tiered system for free plays based on $CLANKSTER token holdings.

12. **How to Play Dialog**: Includes a dialog component to display game rules and mechanics to players.

The project is open-source and welcomes contributions. See the README.md for setup instructions and more details.

