import {ReactNode} from "react"
import Home from "./page"
import {GetProjects} from "@/lib/actions"

export default async function Layout({children}: {children: ReactNode}) {
    const projects = await GetProjects()

    return <Home projects={projects as any} />
}
