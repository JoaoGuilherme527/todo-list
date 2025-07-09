import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import {ReactNode} from "react"
import { AppContextProvider } from "@/context/AppProvider"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Todo list",
    description: "Simple todo list",
}

export default function RootLayout({children}: {children: ReactNode}) {

    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
                <AppContextProvider>{children}</AppContextProvider>
            </body>
        </html>
    )
}
