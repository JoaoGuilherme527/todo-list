"use client"

import {BoltIcon, BookOpenIcon, Layers2Icon, LogOutIcon, PinIcon, UserPenIcon} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {signOut, useSession} from "next-auth/react"
import {Skeleton} from "../ui/skeleton"
import {SidebarLink} from "../ui/sidebar"
import {usePathname} from "next/navigation"

export default function UserMenu() {
    const {data: session, status} = useSession()
    const path = usePathname()
    return (
        <>
            {status === "loading" ? (
                <Skeleton className="size-8 rounded-full" />
            ) : (
                <SidebarLink
                    link={{
                        label: session?.user.name as string,
                        href: path,
                        icon: (
                            <img
                                src={session?.user.image as string}
                                className="h-6 w-6 shrink-0 rounded-full"
                                width={50}
                                height={50}
                                alt="Avatar"
                            />
                        ),
                    }}
                />
            )}
        </>
    )
}
