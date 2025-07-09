import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {IconPlus} from "@tabler/icons-react"
import {CreateColumn, CreateProject} from "@/lib/actions"
import {Button} from "@/components/ui/button"

export function DialogCreateProject() {
    return (
        <Dialog>
            <DialogContent className="sm:max-w-[425px] bg-secondary">
                <form action={CreateProject} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription>Create a new project. Click Save changes to add at your Dashboard.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Project</Label>
                            <Input id="name" name="name" placeholder="Project name" />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" className="cursor-pointer">
                                Save changes
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
            <DialogTrigger>
                <Button
                    className="cursor-pointer bg-secondary text-primary hover:bg-primary-foreground border flex items-center gap-2 w-full"
                    size="sm"
                >
                    <IconPlus /> Create a Project
                </Button>
            </DialogTrigger>
        </Dialog>
    )
}

export function DialogCreateColumn({projectId}: {projectId: string}) {
    return (
        <Dialog>
            <DialogContent className="sm:max-w-[425px] bg-secondary">
                <form action={CreateColumn} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Add column</DialogTitle>
                        <DialogDescription>Create a new column. Click Save changes to add at your list.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Column name" />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="color">Color</Label>
                            <Input id="color" name="color" type="color" />
                            <Input id="projectId" type="text" name="projectId" defaultValue={projectId} value={projectId} hidden readOnly />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" className="cursor-pointer">
                                Save changes
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
            <DialogTrigger className="flex items-center gap-2 cursor-pointer">
                <Button className="cursor-pointer bg-secondary text-primary hover:bg-primary-foreground border" size="sm">
                    <IconPlus /> Add Column
                </Button>
            </DialogTrigger>
        </Dialog>
    )
}
