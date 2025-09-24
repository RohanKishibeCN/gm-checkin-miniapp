import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GM Check-in App',
  description: 'Daily GM check-in app with streak rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}