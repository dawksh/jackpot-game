import { NextResponse, NextRequest } from "next/server";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// To handle a GET request to /api
export async function GET(request: NextRequest) {
    // Do whatever you want
    const amount = request.nextUrl.searchParams.get("amount")
    const winner = request.nextUrl.searchParams.get("winner")
    const signature = await genSig(BigInt(amount as string), winner as string)
    return NextResponse.json({ signature }, { status: 200 });
}

const genSig = async (amount: BigInt, winner: string) => {
    const CLAIM_CONTRACT_ADDRESS: `0x${string}` =
        "0xcb8F593526Ef882a153CfD80D17DbBB9576CcF7c";
    const chainId = 8453;
    const domainName = "JackpotGameStore";
    const domainVersion = "1";

    const account = privateKeyToAccount(
        process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`
    );

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
            { name: "winner", type: "address" },
            { name: "amount", type: "uint256" },
        ],
    };

    const message = {
        winner: winner || account.address,
        amount,
    };

    const signature = await client.signTypedData({
        domain,
        types,
        primaryType: "claim",
        message,
    });

    return signature;
};