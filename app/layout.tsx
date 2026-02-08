import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Secret Valentine",
  description: "Send and receive anonymous Valentine cards from friends",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#120101",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-[#120101]">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(30, 5, 5, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fafafa",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  )
}
