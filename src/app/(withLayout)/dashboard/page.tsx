"use client"

import {DialogCreateProject} from "@/components/CustomDialogs"
import {CustomToast} from "@/components/CustomToast"
import ProjectsComponent from "@/components/ProjectsComponent"
import {useAppContext} from "@/context/AppProvider"
import {AppProject} from "next-auth"
import {useCallback, useEffect, useLayoutEffect, useState, useTransition} from "react"

export default function Dashboard() {
    // const [isProjects, setIsProjects] = useState()
    const {refreshProjects, load, refreshLoad, projects} = useAppContext()
    const [isLoading, setTransition] = useTransition()

    // useEffect(() => {
    //     setIsProjects(projects)
    // }, [projects])

    useEffect(() => {
        setTransition(() => {
            refreshProjects()
        })
    }, [load])

    // const loadToast = useCallback(
    //   () => {

    //   },
    //   [refreshLoad],
    // )

    return (
        <div className="p-2 flex flex-col gap-4 h-full">
            <h1 className="text-3xl font-bold">Projects</h1>
            <DialogCreateProject />
            <ProjectsComponent isPending={isLoading} projects={projects as AppProject[]} />
            <CustomToast loading={isLoading} />
        </div>
    )
}
