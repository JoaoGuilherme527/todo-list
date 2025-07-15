"use client"
import React, {ReactNode, useState} from "react"
import {IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt} from "@tabler/icons-react"
import {motion} from "motion/react"
import {cn} from "@/lib/utils"
import {Sidebar, DesktopSidebar, MobileSidebar, SidebarBody, SidebarLink, SidebarProvider, useSidebar} from "./ui/sidebar"
import HeaderComponent from "./HeaderComponent"
import {SessionProvider, signOut, useSession} from "next-auth/react"
import UserMenu from "./navbar-components/user-menu"
import {usePathname, useRouter} from "next/navigation"
import {ToastProvider} from "./ui/toast"
import {AppContextProvider} from "@/context/AppProvider"
export function SidebarComponent({children}: {children: ReactNode}) {
    const {data: session} = useSession()
    
    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        // {
        //     label: "Create project",
        //     href: "#",
        //     icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        // },
        // {
        //     label: "Settings",
        //     href: "#",
        //     icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        // },
    ]
    const [open, setOpen] = useState(false)
    return (
        <div className={cn("mx-auto flex w-full flex-1 flex-col overflow-hidden bg-secondary md:flex-row border-accent", "h-screen")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-5">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            <LogoutButton />
                        </div>
                    </div>
                    <div className=" overflow-x-hidden">
                        <UserMenu />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard open={open}>{children}</Dashboard>
        </div>
    )
}

const LogoutButton = () => {
    const {open, animate} = useSidebar()
    const route = useRouter()
    return (
        <div
            className={cn("flex items-center justify-start gap-2  group/sidebar py-2 cursor-pointer")}
            onClick={() => {
                signOut()
                route.push("/login")
            }}
        >
            <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
                Logout
            </motion.span>
        </div>
    )
}

export const Logo = () => {
    return (
        <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span initial={{opacity: 0}} animate={{opacity: 1}} className="font-medium whitespace-pre text-black dark:text-white">
                Todo List
            </motion.span>
        </a>
    )
}
export const LogoIcon = () => {
    return (
        <a href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div className="h-5 w-5 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white transition" />
        </a>
    )
}

const Dashboard = ({children, open}: {children: ReactNode; open: boolean}) => {
    return (
        <div className="flex flex-1">
            <div
                className="flex h-full flex-1 flex-col gap-2 rounded-tl-2xl border bg-primary-foreground border-neutral-200  dark:border-neutral-700"
                style={{width: open ? "calc(100vw - 300px)" : "calc(100vw - 60px)"}}
            >
                {children}
            </div>
        </div>
    )
}
