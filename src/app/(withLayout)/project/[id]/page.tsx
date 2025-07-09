import KanbanComponent from "@/components/KanbanComponent"
import {Button} from "@/components/ui/button"
import {IconPlus} from "@tabler/icons-react"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription,
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {AppColumn} from "next-auth"
import {CreateColumn, CreateTodo} from "@/lib/actions"
import {DialogCreateColumn} from "@/components/CustomDialogs"
export default async function Kanban({columns, projectId}: {columns: AppColumn[]; projectId: string}) {
    return (
        <main
            // initial={{opacity: 0, y: 20}}
            // animate={{opacity: 1, y: 0}}
            // transition={{duration: 0.5}}
            className="flex flex-col gap-3 h-full p-2"
        >
            <div className="w-full flex gap-3">
                <DialogCreateColumn projectId={projectId} />
                <Dialog>
                    <DialogContent className="sm:max-w-[425px] bg-secondary">
                        <form action={CreateTodo} className="flex flex-col gap-4">
                            <DialogHeader>
                                <DialogTitle>Add Todo item</DialogTitle>
                                <DialogDescription>Fill the info below and save your todo.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="todo-name">Content</Label>
                                    <Input id="todo-name" placeholder="Todo name" name="content" required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="startAt">Start Date</Label>
                                    <Input id="startAt" type="date" name="startAt" required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="endAt">End Date</Label>
                                    <Input id="endAt" type="date" name="endAt" required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="columnId">Column</Label>
                                    <select id="columnId" name="columnId" className="border p-2 rounded" required>
                                        <option value="">Select a column</option>
                                        {columns &&
                                            columns.map((col) => (
                                                <option key={col.id} value={col.id}>
                                                    {col.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit" className="cursor-pointer">
                                        Save Todo
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>

                    {columns && columns.length > 0 && (
                        <DialogTrigger className="flex items-center cursor-pointer">
                            <Button className="cursor-pointer bg-secondary text-primary hover:bg-primary-foreground border" size="sm">
                                <IconPlus /> Add Todo Item
                            </Button>
                        </DialogTrigger>
                    )}
                </Dialog>

                {/* <CustomToast /> */}
            </div>
            <main
                // initial={{opacity: 0, y: 20}}
                // animate={{opacity: 1, y: 0}}
                // transition={{duration: 0.5}}
                className="h-full w-full overflow-x-scroll"
            >
                <KanbanComponent columnItems={columns} projectId={projectId} />
            </main>
        </main>
    )
}
