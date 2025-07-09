"use client"

import {ToastProvider} from "@/components/ui/toast"
import {Project} from "@prisma/client"
import {SessionProvider} from "next-auth/react"
import React, {createContext, useContext, useState, type ReactNode} from "react"

interface AppContextType {
    currentProjectId: string | undefined
    setCurrentProjectId: (param: string | undefined) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider")
    }
    return context
}

interface AppContextProviderProps {
    children: ReactNode
}

export function AppContextProvider({children}: AppContextProviderProps) {
    const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(undefined)

    return (
        <AppContext.Provider value={{currentProjectId, setCurrentProjectId}}>
            <ToastProvider swipeDirection="left">
                <SessionProvider>{children}</SessionProvider>
            </ToastProvider>
        </AppContext.Provider>
    )
}
