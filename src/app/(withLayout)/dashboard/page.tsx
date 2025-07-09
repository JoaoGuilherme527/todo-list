import {DialogCreateProject} from "@/components/CustomDialogs"
import ProjectsComponent from "@/components/ProjectsComponent"

export default function Dashboard() {
    return (
        <div className="p-2 flex flex-col gap-4 h-full">
            <h1 className="text-3xl font-bold">Projects</h1>
            <DialogCreateProject/>
            <ProjectsComponent />
        </div>
    )
}
