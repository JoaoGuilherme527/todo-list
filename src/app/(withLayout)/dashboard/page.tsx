"use client"

import {DialogCreateProject} from "@/components/CustomDialogs"
import ProjectsComponent from "@/components/ProjectsComponent"
import {useAppContext} from "@/context/AppProvider"
import {AppProject} from "next-auth"
import {useEffect, useTransition} from "react"

export default function Dashboard() {
    const {projects, refreshProjects} = useAppContext()
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(() => {
            refreshProjects()
        })
    }, [refreshProjects])

    return (
        <div className="p-2 flex flex-col gap-4 h-full">
            <h1 className="text-3xl font-bold">Projects</h1>
            <DialogCreateProject />
            <ProjectsComponent isPending={isPending} projects={projects as AppProject[]} />
        </div>
    )
}
