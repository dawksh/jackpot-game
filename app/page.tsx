"use client"

import JackpotGame from "../jackpot-game"
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })

export default function SyntheticV0PageForDeployment() {
  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-900 text-white ${inter.className}`}>
      <h1 className={`text-4xl font-bold mb-4 ${montserrat.className} text-blue-400`}>Under Maintenance</h1>
      <p className="text-xl mb-8 text-gray-200">We're currently performing some updates to improve your experience.</p>
      <div className="flex flex-col gap-4">
        <p className="text-gray-300">We'll be back soon!</p>
        <p className="text-sm text-gray-400">Thank you for your patience.</p>
      </div>
    </div>
  )
  // return (
  //   <JackpotGame />
  // )
}