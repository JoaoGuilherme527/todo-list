import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import {z} from "zod"
import {prisma} from "@/index"

const projectCreateSchema = z.object({
    name: z.string().min(2, "Project name required"),
})

const projectUpdateSchema = z.object({
    id: z.string().cuid("Invalid ID"),
    name: z.string().min(2, "Name must have at least 2 characters"),
})

export type ProjectFormData = z.infer<typeof projectCreateSchema>


export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new Response("Unauthorized", {status: 401})
    }

    const body = await req.json()
    const parsed = projectCreateSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({error: parsed.error.flatten()}, {status: 400})
    }

    try {
        const project = await prisma.project.create({
            data: {
                name: parsed.data.name,
                owner: {connect: {email: session.user.email!}},
            },
        })
        return Response.json(project, {status: 201})
    } catch {
        return Response.json({error: "Erro ao criar projeto"}, {status: 500})
    }
}

export async function GET({params}: {params: Promise<{ownerId: string}>}) {
    const {ownerId} = await params

    try {
        const projects = await prisma.project.findMany({
            where: {ownerId},
            include: {columns: true, owner: true},
            orderBy: {name: "asc"},
        })
        return Response.json(projects)
    } catch {
        return Response.json({error: "Erro ao buscar projetos"}, {status: 500})
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new Response("Unauthorized", {status: 401})
    }

    const body = await req.json()
    const parsed = projectUpdateSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({error: parsed.error.flatten()}, {status: 400})
    }

    try {
        const updated = await prisma.project.update({
            where: {id: parsed.data.id},
            data: {name: parsed.data.name},
        })
        return Response.json(updated)
    } catch {
        return Response.json({error: "Erro ao atualizar projeto"}, {status: 500})
    }
}

export async function DELETE(req: Request) {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get("id")

    if (!id || !z.string().cuid().safeParse(id).success) {
        return Response.json({error: "Invalid ID"}, {status: 400})
    }

    try {
        await prisma.project.delete({where: {id}})
        return Response.json({message: "Project deleted"}, {status: 200})
    } catch (err) {
        console.error("Error deleting project:", err)
        return Response.json({error: "Error deleting project"}, {status: 500})
    }
}
