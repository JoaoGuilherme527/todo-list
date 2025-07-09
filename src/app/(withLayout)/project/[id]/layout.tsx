import HeaderComponent from "@/components/HeaderComponent"
import Kanban from "./page"
import {GetColumnItems} from "@/lib/actions"
import {AppColumn} from "next-auth"

export default async function Layout({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const columns = await GetColumnItems(id)

    return (
        <div className="flex flex-col h-screen">
            <HeaderComponent id={id} />
            <Kanban columns={columns as AppColumn[]} projectId={id} />
        </div>
    )
}
