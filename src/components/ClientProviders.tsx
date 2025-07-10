"use client"

import { AppContextProvider } from "@/context/AppProvider"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </SessionProvider>
  )
}
