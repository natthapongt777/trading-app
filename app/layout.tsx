import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trading Journal',
  description: 'Personal trade history & setup tracker',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Trading Journal',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="theme-color" content="#030712" />
      </head>
      <body className="bg-gray-950 antialiased">{children}</body>
    </html>
  )
}
