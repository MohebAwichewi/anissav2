import type { Metadata } from 'next'
import { Playfair_Display, Poppins, Pinyon_Script } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-logo',
  weight: ['400', '500', '600']
})

const poppins = Poppins({ 
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
})

const pinyon = Pinyon_Script({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-sign'
})

export const metadata: Metadata = {
  title: "M.A Tradition - L'Art de l'Héritage",
  description: "L'élégance tunisienne, sublimée au quotidien.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${poppins.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  )
}