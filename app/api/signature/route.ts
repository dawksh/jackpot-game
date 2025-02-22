import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const amount = request.nextUrl.searchParams.get("amount")
    const winner = request.nextUrl.searchParams.get("winner")
    const { data: { signature } } = await axios.get("https://jackpot-backend.up.railway.app/signature", {
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`
        },
        params: {
            amount: amount?.toString(),
            winner
        }
    })
    return NextResponse.json({ signature }, { status: 200 });
}

