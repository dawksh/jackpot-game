export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Jackpot Terms & Conditions</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                    Welcome to Jackpot, a fully on-chain slots game built on Base. By using this game, you acknowledge and agree to these Terms & Conditions. This is an experimental and fun game—play at your own risk.
                </p>
                <p>
                    Jackpot is powered by Clanker tech and built by @clanksteronbase.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Experimental Nature & Disclaimer of Liability</h2>
                <p className="mb-4">
                    Jackpot is an experimental, decentralized game deployed on the Base blockchain.
                </p>
                <p className="mb-4">
                    Smart contracts are unaudited—users should review the code before interacting: <a href="https://github.com/Clankster/jackpot-game" className="text-blue-500 hover:underline">GitHub Repository</a>.
                </p>
                <p className="mb-4">
                    By playing, you acknowledge the potential risks, including but not limited to smart contract bugs, network congestion, or other unforeseen issues that could result in loss of funds.
                </p>
                <p>
                    No refunds are provided, and we do not take responsibility for lost tokens due to contract errors, exploits, or user mistakes.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Game Mechanics</h2>
                <p className="mb-4">
                    Players deposit 100,000 $JACKPOT tokens per spin to participate.
                </p>
                <p className="mb-4">
                    The game randomly generates three symbols.
                </p>
                <p className="mb-4">
                    Winning Conditions:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li>🎰🎰🎰 (three slot machine emojis) → Win the full prize pool (100%).</li>
                    <li>Any other three identical symbols → Win a partial payout (10% of the prize pool).</li>
                    <li>If no match, the spin is lost.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Clankster Free Play Perks</h2>
                <p className="mb-4">
                    Holding $CLANKSTER tokens grants free daily plays:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li>1M - 9M → 1 free play per day</li>
                    <li>10M - 99M → 5 free plays per day</li>
                    <li>100M - 249M → 10 free plays per day</li>
                    <li>250M - 499M → 15 free plays per day</li>
                    <li>500M - 999M → 25 free plays per day</li>
                    <li>1B+ → 35 free plays per day</li>
                </ul>
                <p>
                    Free plays reset daily and cannot be accumulated.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Prize Pool & Payouts</h2>
                <p className="mb-4">
                    The prize pool grows from three sources:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li>$200 worth of $JACKPOT tokens added each time the jackpot resets.</li>
                    <li>Player deposits (100K $JACKPOT per spin, minus operational reserve).</li>
                    <li>Sell fees from $JACKPOT token transactions.</li>
                </ul>
                <p className="mb-4">
                    10% of every deposit is allocated to an operational reserve to help sustain game development and ongoing prize pool funding.
                </p>
                <p>
                    Payouts are executed directly via the smart contract upon a winning spin. Players will need to manually claim their winnings from the game.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Odds of Winning</h2>
                <p className="mb-4">
                    Disclaimer: The following odds are estimated based on our best calculations and may vary due to randomness and system mechanics.
                </p>
                <h3 className="text-xl font-semibold mb-2">Full Jackpot (🎰🎰🎰)</h3>
                <p className="mb-4">
                    Odds: 1 in 15,625 spins
                </p>
                <p className="mb-4">
                    Calculation:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li>Each reel has a 1 in 25 chance to land on 🎰.</li>
                    <li>(1/25) × (1/25) × (1/25) = 1/15,625 spins, which is about 1 in 15,625 spins.</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Partial Jackpot (Any 3 matching non-🎰 symbols)</h3>
                <p className="mb-4">
                    Odds: Approximately 1 in 651 spins
                </p>
                <p className="mb-4">
                    Calculation:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li>For any specific non-🎰 symbol, the chance on one reel is 1 in 25.</li>
                    <li>The probability for three matching non-🎰 symbols is (1/25)³ = 1/15,625.</li>
                    <li>With 24 possible non-🎰 symbols, the total probability is 24 × 1/15,625 = 1/651, which is about 1 in 651 spins.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Play at Your Own Risk</h2>
                <p className="mb-4">
                    This game is decentralized and operates via smart contracts. There is no central authority to reverse transactions or recover lost funds.
                </p>
                <p>
                    Users should never invest more than they can afford to lose.
                </p>
                <p>
                    Jackpot is provided "as-is" without warranties, and we are not liable for any technical issues, exploits, losses, or unforeseen consequences of playing.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Responsible Play</h2>
                <p className="mb-4">
                    This game is designed for fun and entertainment.
                </p>
                <p className="mb-4">
                    We do not promote gambling—players should approach the game with a responsible mindset.
                </p>
                <p>
                    Users are responsible for complying with their local laws regarding blockchain gaming and virtual asset transactions.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Updates & Changes</h2>
                <p>
                    These Terms & Conditions may be updated at any time. Continued use of the game signifies acceptance of the latest version.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                <p className="mb-4">
                    For inquiries or community discussions, join us on:
                </p>
                <ul className="list-disc pl-8">
                    <li>X (<a href="https://x.com/Jackpotgame" className="text-blue-500 hover:underline">@Jackpotgame</a>)</li>
                    <li>Telegram (<a href="https://t.me/jackpotonbase" className="text-blue-500 hover:underline">@jackpotonbase</a>)</li>
                    <li>Warpcast (<a href="https://warpcast.com/jackpotgame" className="text-blue-500 hover:underline">@jackpotgame</a>)</li>
                </ul>
                <p className="mt-8 text-lg font-semibold">
                    By playing Jackpot, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
                </p>
            </section>
        </div>
    );
}
