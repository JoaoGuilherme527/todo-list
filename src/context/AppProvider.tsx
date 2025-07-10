"use client"

import {ToastProvider} from "@/components/ui/toast"
import {GetProjects} from "@/lib/actions"
import {Project} from "@prisma/client"
import {AppProject} from "next-auth"
import {SessionProvider, useSession} from "next-auth/react"
import React, {createContext, useCallback, useContext, useState, type ReactNode} from "react"

interface AppContextType {
    currentProjectId: string | undefined
    setCurrentProjectId: (param: string | undefined) => void
    projects: AppProject[] | undefined
    refreshProjects: () => Promise<void>
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
    const {data: session} = useSession()
    const [projects, setProjects] = useState<AppProject[] | undefined>()

    const refreshProjects = useCallback(async () => {
        if (!session?.user.email) return
        const res = await GetProjects(session.user.email)
        setProjects(res as typeof projects)
    }, [session?.user.email])

    return (
        <AppContext.Provider value={{currentProjectId, setCurrentProjectId, projects, refreshProjects}}>
            <ToastProvider swipeDirection="left">
                {children}
            </ToastProvider>
        </AppContext.Provider>
    )
}
