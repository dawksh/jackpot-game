import { Metadata } from "next";
import dynamic from "next/dynamic";

const JackpotGame = dynamic(() => import('@/components/game-wrapper'), {
  ssr: false,
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
  // return (
  //   <div className={`flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-900 text-white ${inter.className}`}>
  //     <h1 className={`text-4xl font-bold mb-4 ${montserrat.className} text-blue-400`}>Under Maintenance</h1>
  //     <p className="text-xl mb-8 text-gray-200">We're currently performing some updates to improve your experience.</p>
  //     <div className="flex flex-col gap-4">
  //       <p className="text-gray-300">We'll be back soon!</p>
  //       <p className="text-sm text-gray-400">Thank you for your patience.</p>
  //     </div>
  //   </div>
  // )
  return (
    <JackpotGame />
  )
}