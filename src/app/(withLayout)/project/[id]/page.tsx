import HeaderComponent from "@/components/HeaderComponent"
import ProjectPage from "@/components/pages/ProjectPage"
import {GetColumnItems} from "@/lib/actions"
import {AppColumn} from "next-auth"

export default async function Project({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const columns = await GetColumnItems(id)

    return (
        <div className="flex flex-col h-screen">
            <HeaderComponent id={id} />
            <ProjectPage columns={columns as AppColumn[]} projectId={id} />
        </div>
    )
}
