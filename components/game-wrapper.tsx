"use client"

import JackpotGame from '@/jackpot-game'
import React, { useEffect, useState } from 'react'
import sdk from "@farcaster/frame-sdk";

const GameWrapper = () => {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            await sdk.actions.ready();
            console.log(sdk)
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);
    return (
        <div>
            <JackpotGame />
        </div>
    )
}

export default GameWrapper