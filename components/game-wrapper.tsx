"use client"

import JackpotGame from '@/jackpot-game'
import React, { useEffect, useState } from 'react'
import sdk, { Context } from "@farcaster/frame-sdk";

const GameWrapper = () => {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<Context.FrameContext>();

    useEffect(() => {
        const load = async () => {
            setContext(await sdk.context);
            sdk.actions.ready();
        };
        load();
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
        }
    }, [isSDKLoaded]);

    if (!isSDKLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <JackpotGame />
        </div>
    )
}

export default GameWrapper