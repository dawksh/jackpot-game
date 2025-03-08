import { Metadata } from "next";
import dynamic from "next/dynamic";

const GameWrapper = dynamic(() => import('@/components/game-wrapper'), {
  ssr: true,
});

const frame = {
  version: "next",
  imageUrl: `https://i.ibb.co/VY9f2MCP/IMG-1693.jpg`,
  button: {
    title: "Play",
    action: {
      type: "launch_frame",
      name: "Jackpot Casino",
      url: "https://i.ibb.co/VY9f2MCP/IMG-1693.jpg",
      splashImageUrl: "https://i.ibb.co/VY9f2MCP/IMG-1693.jpg",
      splashBackgroundColor: "#4a7cf7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Jackpot Casino",
    openGraph: {
      title: "Jackpot Casino",
      description: "A Jackpot Casino game frame by Clankster.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}


export default function Page() {
  return (
    <GameWrapper />
  )
}