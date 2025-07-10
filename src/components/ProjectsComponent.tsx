"use client"

import {cn} from "@/lib/utils"
import {AnimatedGridPattern} from "./magicui/animated-grid-pattern"
import {motion} from "framer-motion"
import EditDropDownMenu from "./EditDropDownMenuComponent"
import Link from "next/link"
import {DeleteProject, GetProjects} from "@/lib/actions"
import {useSession} from "next-auth/react"
import {useEffect, useLayoutEffect, useState, useTransition} from "react"
import {AppProject} from "next-auth"
import {useAppContext} from "@/context/AppProvider"

export default function ProjectsComponent({isPending, projects}: {isPending: boolean; projects: AppProject[]}) {
    const {data: session, status} = useSession()
    const {refreshProjects} = useAppContext()
    const [isLoading, startTransition] = useTransition()

    useEffect(() => {
        startTransition(() => {
            refreshProjects()
        })
    }, [refreshProjects])

    return (
        <div className="flex w-full h-full flex-wrap gap-2 relative">
            <AnimatedGridPattern
                numSquares={isPending || isLoading ? 200 : 30}
                maxOpacity={0.1}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-10%] h-[200%] skew-y-12"
                )}
            />
            {projects &&
                projects.map(({name, id, columns}, index) => (
                    <motion.div
                        className="rounded w-56 border flex flex-col overflow-hidden max-h-56 z-10 bg-primary-foreground"
                        initial={{opacity: 0, x: 200}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        key={index}
                    >
                        <div className="w-full items-center flex justify-between bg-accent">
                            <Link href={"/project/" + id} className=" px-2 underline p-1 border-b">
                                <p>{name}</p>
                            </Link>
                            <EditDropDownMenu id={id} action={DeleteProject} />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 p-2 h-full overflow-y-scroll">
                            {columns &&
                                columns.map(({name, color, todos}, index) => {
                                    return (
                                        <div className="flex items-center gap-2 w-full" key={index}>
                                            <div className="rounded-full w-2 h-2" style={{background: color}} />
                                            <div className="flex items-center justify-between w-full">
                                                <p>{name}</p>
                                                <p>{todos ? todos.length : 0}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </motion.div>
                ))}
        </div>
    )
}
