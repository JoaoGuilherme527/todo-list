'use server'

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function GetProjects(email: string) {
    try {
        const projects = await prisma.project.findMany({
            where: { ownerId: email },
            include: {
                columns: {
                    include: {
                        todos: true
                    }
                }, owner: true
            },
        })
        return projects
    } catch (error) {
        console.log({ error: "Get projects error: " + error }, { status: 500 });
    }
}

export async function CreateProject(formData: FormData) {
    try {
        await prisma.project.create({
            data: {
                name: formData.get("name") as string,
                owner: { connect: { email: formData.get("email") as string} },
            },
        })

        revalidatePath("/dashboard")
    } catch (error) {
        console.log({ error: "Create project error: " + error }, { status: 500 });
    }
}

export async function DeleteProject(formData: FormData) {
    const id = formData.get("id") as string

    try {
        await prisma.project.delete({ where: { id } })
        revalidatePath("/dashboard")
    } catch (err) {
        console.error("Error deleting project:", err)
    }
}

export async function GetColumnItems(projectId: string) {
    try {
        const columns = await prisma.column.findMany({
            where: { projectId },
            include: {
                todos: {
                    include: { owner: true }
                }
            },
        })
        return columns
    } catch (error) {
        console.log({ error: "Get column items error: " + error }, { status: 500 });
    }
}

export async function CreateColumn(formData: FormData) {
    const { name, color, projectId } = {
        name: formData.get("name") as string,
        color: formData.get("color") as string,
        projectId: formData.get("projectId") as string
    }


    try {
        const existing = await prisma.column.findFirst({
            where: {
                projectId,
                OR: [{ name }, { color }],
            },
        })

        if (existing) {
            alert(`A column with the same ${existing.name === name ? "name" : "color"} already exists.`)
        }

        await prisma.column.create({ data: { name, color, projectId } })

        revalidatePath("/project")

    } catch (err) {
        console.error("Error creating column:", err)
    }
}

export async function DeleteColumn(formData: FormData) {
    const id = formData.get("id") as string

    try {
        await prisma.column.delete({ where: { id } })
        revalidatePath("/")
    } catch (err) {
        console.error("Error deleting column:", err)
    }
}

export async function CreateTodo(formData: FormData) {
    const body = {
        content: formData.get("content") as string,
        startAt: new Date(formData.get("startAt") as string),
        endAt: new Date(formData.get("endAt") as string),
        column: { connect: { id: formData.get("columnId") as string } },
        owner: { connect: { email: formData.get("email") as string } },
    }

    try {
        await prisma.todoItem.create({
            data: body,
        })
        revalidatePath("/project")
    } catch (error) {
        console.log({ error: "Create todo error: " + error }, { status: 500 });
    }
}

export async function PatchTodo({ id, columnId }: { id: string, columnId: string }) {
    try {
        await prisma.todoItem.update({
            where: { id },
            data: { column: { connect: { id: columnId } } },
        })
        revalidatePath("/project")
    } catch {
        return Response.json({ error: "Erro ao mover todo" }, { status: 500 })
    }
}

export async function DeleteTodo(formData: FormData) {
    const id = formData.get("id") as string

    try {
        await prisma.todoItem.delete({ where: { id } })
        revalidatePath("/project")
    } catch (err) {
        console.error("Error deleting todo:", err)
    }
}