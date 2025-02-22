import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const amount = request.nextUrl.searchParams.get("amount")
    const winner = request.nextUrl.searchParams.get("winner")
    const { data: { signature } } = await axios.get("http://127.0.0.1:3000/signature", {
        headers: {
            "Authorization": "Bearer 5ed1d456-43fe-4921-8007-bb2adc957d6a"
        },
        params: {
            amount: amount?.toString(),
            winner
        }
    })
    return NextResponse.json({ signature }, { status: 200 });
}

