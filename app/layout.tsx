import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jackpot Game',
  description: 'Play and earn with Jackpot Game!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://yoink.party/img/start.png","button":{"title":"Win $JACKPOT","action":{"type":"launch_frame","name":"JACKPOT","url":"https://yoink.party/","splashImageUrl":"https://yoink.party/img/splash.png","splashBackgroundColor":"#eeeee4"}}}' />
      </head>
      <body>{children}</body>
    </html>
  )
}
