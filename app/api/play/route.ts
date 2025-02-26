import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { player } = await request.json()
    const { data: { hash } } = await axios.post("https://jackpotgame.up.railway.app/play", {
        player
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`
        }
    })
    return NextResponse.json({ hash }, { status: 200 });
}

