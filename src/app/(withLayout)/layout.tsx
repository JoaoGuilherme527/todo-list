import HeaderComponent from "@/components/HeaderComponent"
import {SidebarComponent} from "@/components/SideBarComponent"
import {SessionProvider, useSession} from "next-auth/react"
import {ReactNode} from "react"

export default async function Layout({children}: {children: ReactNode}) {
    return (
        <div className="w-full flex flex-col h-screen">
            <SidebarComponent>{children}</SidebarComponent>
        </div>
    )
}
