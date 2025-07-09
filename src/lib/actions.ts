'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/index";
import { projectCreateSchema, ProjectFormData } from "@/types/api";
import { Column, Project, TodoItem } from "@prisma/client";
import { AppColumn, AppProject, AppTodoItem, getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

async function ValidateSession() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return
    }
    else return session
}

export async function GetProjects() {
    const session = await ValidateSession()
    try {
        const email = session?.user.email as string
        const user = await prisma.user.findUnique({
            where: { email }
        })
        const projects = await prisma.project.findMany({
            where: { ownerId: user?.email },
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
        return Response.json({ error: "Get projects error: " + error }, { status: 500 })
    }
}

export async function CreateProject(formData: FormData) {
    const session = await ValidateSession()
    try {
        await prisma.project.create({
            data: {
                name: formData.get("name") as string,
                owner: { connect: { email: session?.user.email! } },
            },
        })

        revalidatePath("/")
    } catch (error) {
        console.log({ error: "Create project error: " + error }, { status: 500 });
    }
}

export async function DeleteProject(formData: FormData) {
    await ValidateSession()

    const id = formData.get("id") as string

    try {
        await prisma.project.delete({ where: { id } })
        revalidatePath("/")
    } catch (err) {
        console.error("Error deleting project:", err)
    }
}

export async function GetColumnItems(projectId: string) {
    await ValidateSession()
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
    await ValidateSession()

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

        revalidatePath("/")

    } catch (err) {
        console.error("Error creating column:", err)
    }
}

export async function DeleteColumn(formData: FormData) {
    await ValidateSession()

    const id = formData.get("id") as string

    try {
        await prisma.column.delete({ where: { id } })
        revalidatePath("/")
    } catch (err) {
        console.error("Error deleting column:", err)
    }
}

export async function CreateTodo(formData: FormData) {
    const session = await ValidateSession()

    const body = {
        content: formData.get("content") as string,
        startAt: new Date(formData.get("startAt") as string),
        endAt: new Date(formData.get("endAt") as string),
        column: { connect: { id: formData.get("columnId") as string } },
        owner: { connect: { email: session?.user.email as string } },
    }

    try {
        await prisma.todoItem.create({
            data: body,
        })
        revalidatePath("/")
    } catch (error) {
        console.log({ error: "Create todo error: " + error }, { status: 500 });
    }
}

export async function PatchTodo({ id, columnId }: { id: string, columnId: string }) {
    await ValidateSession()

    try {
        await prisma.todoItem.update({
            where: { id },
            data: { column: { connect: { id: columnId } } },
        })
        revalidatePath("/")
    } catch {
        return Response.json({ error: "Erro ao mover todo" }, { status: 500 })
    }
}

export async function DeleteTodo(formData: FormData) {
    await ValidateSession()

    const id = formData.get("id") as string

    try {
        await prisma.todoItem.delete({ where: { id } })
        revalidatePath("/")
    } catch (err) {
        console.error("Error deleting todo:", err)
    }
}