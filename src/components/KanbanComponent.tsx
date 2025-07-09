"use client"

import {useEffect, useLayoutEffect, useState} from "react"
import {DragEndEvent, KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider} from "./ui/kibo-ui/kanban"
import {motion} from "framer-motion"
import {DeleteColumn, DeleteTodo, GetColumnItems, PatchTodo} from "@/lib/actions"
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"
import {AppColumn, User} from "next-auth"
import EditDropDownMenu from "./EditDropDownMenuComponent"

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
})

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
})

type KanbanItem = {
    id: string
    name: string
    column: string
    owner: User
    ownerId: string
    startAt: Date
    endAt: Date
}

export default function KanbanComponent({columnItems, projectId}: {columnItems: AppColumn[]; projectId: string}) {
    const [columns, setColumns] = useState(columnItems.map(({color, id, name}) => ({color, id, name})))
    const [todos, setTodos] = useState(() =>
        columnItems.flatMap(
            (col) =>
                col.todos?.map((todo) => ({
                    id: todo.id,
                    name: todo.content,
                    column: col.id,
                    ownerId: todo.ownerId,
                    owner: todo.owner,
                    startAt: new Date(todo.startAt),
                    endAt: new Date(todo.endAt),
                })) ?? []
        )
    )

    const refresh = async () => {
        const cs = await GetColumnItems(projectId)
        if (!cs) {
            return
        }
        setColumns(cs.map(({color, id, name}) => ({color, id, name})))
        const allTodos = cs.flatMap(
            (col) =>
                col.todos?.map((todo) => ({
                    id: todo.id,
                    name: todo.content,
                    column: col.id,
                    ownerId: todo.ownerId as string,
                    owner: todo.owner,
                    startAt: new Date(todo.startAt),
                    endAt: new Date(todo.endAt),
                })) ?? []
        )
        setTodos(allTodos as typeof todos)
    }

    useLayoutEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        refresh()
    }, [columnItems])

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event
        if (!over) return

        const destColumn = columns.find((c) => c.id === over.id)
        if (!destColumn) return

        setTodos((prev) => (prev ?? []).map((todo) => (todo.id === active.id ? {...todo, column: destColumn.id} : todo)))

        await PatchTodo({id: active.id as string, columnId: destColumn.id})
    }

    return (
        <KanbanProvider columns={columns} data={todos} onDragEnd={handleDragEnd} className="h-full w-full overflow-x-scroll flex gap-3">
            {(column) => (
                <motion.div
                    key={column.id}
                    initial={{opacity: 0, x: 40}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5}}
                    className="min-w-72 flex-1 outline-0"
                >
                    <KanbanBoard id={column.id} className="w-full outline-0">
                        <KanbanHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: column.color}} />
                                    <span>{column.name}</span>
                                </div>
                                <EditDropDownMenu id={column.id} action={DeleteColumn} />
                            </div>
                        </KanbanHeader>
                        <KanbanCards id={column.id} className="overflow-y-auto outline-0">
                            {(todo: KanbanItem) => (
                                <KanbanCard
                                    className="bg-primary-foreground shadow-md outline-0"
                                    column={column.id}
                                    id={todo.id}
                                    key={todo.id}
                                    name={todo.name}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex flex-col gap-1">
                                            <p className="m-0 flex-1 font-medium text-sm">{todo.name}</p>
                                        </div>
                                        <EditDropDownMenu id={todo.id} action={DeleteTodo} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="m-0 text-muted-foreground text-xs">
                                            {shortDateFormatter.format(todo.startAt)} - {dateFormatter.format(todo.endAt)}
                                        </p>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <p>{todo.owner.name as string}</p>
                                            <Avatar className="h-6 w-6 shrink-0">
                                                <AvatarImage src={todo.owner.image as string} />
                                                <AvatarFallback>{todo.owner.name as string}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </KanbanCard>
                            )}
                        </KanbanCards>
                    </KanbanBoard>
                </motion.div>
            )}
        </KanbanProvider>
    )
}
