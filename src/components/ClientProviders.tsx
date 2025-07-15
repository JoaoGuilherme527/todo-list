"use client"

import {AppContextProvider} from "@/context/AppProvider"
import {SessionProvider} from "next-auth/react"
import {ReactNode} from "react"
import { ToastProvider } from "./ui/toast"

export default function ClientProviders({children}: {children: ReactNode}) {
    return (
        <SessionProvider>
            <ToastProvider swipeDirection="left">
                <AppContextProvider>{children}</AppContextProvider>
            </ToastProvider>
        </SessionProvider>
    )
}
