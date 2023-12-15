import {Toaster} from "sonner"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from "@/components/providers/modal-provider"
import { EdgeStoreProvider } from "@/lib/edgestore"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lotion',
  description: 'This is used for project',
  icons:{
    icon:[
      {
        media: "(prefers-color-scheme: light)",
        url: "/Lotion_Whilte.svg",
        href: "/Lotion_Whilte.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/Lotion_Black.svg",
        href: "/Lotion_Black.svg"
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider attribute='class'
              defaultTheme='system' enableSystem
              disableTransitionOnChange storageKey='lotion-theme'
            >
              <Toaster position="bottom-center"/>
              <ModalProvider/>
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
