import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"
import { prisma } from "@/index"

const todoCreateSchema = z.object({
  content: z.string().min(2, "Nome obrigatório"),
  startAt: z.string().refine((d) => !isNaN(Date.parse(d)), "Data inicial inválida"),
  endAt: z.string().refine((d) => !isNaN(Date.parse(d)), "Data final inválida"),
  columnId: z.string().cuid("ID de coluna inválido"),
})

const todoMoveSchema = z.object({
  id: z.string().cuid("ID de todo inválido"),
  columnId: z.string().cuid("ID de coluna inválido"),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const parsed = todoCreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const item = await prisma.todoItem.create({
      data: {
        content: parsed.data.content,
        startAt: new Date(parsed.data.startAt),
        endAt: new Date(parsed.data.endAt),
        column: { connect: { id: parsed.data.columnId } },
        owner: { connect: { id: session.user.id } },
      },
    })
    return Response.json(item, { status: 201 })
  } catch(error) {
    return Response.json({ error }, { status: 500 })
  }
}

export async function GET() {
  try {
    const todos = await prisma.todoItem.findMany({
      include: { owner: true },
      orderBy: { startAt: "asc" },
    })
    return Response.json(todos)
  } catch {
    return Response.json({ error: "Erro ao buscar todos" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const parsed = todoMoveSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const updated = await prisma.todoItem.update({
      where: { id: parsed.data.id },
      data: { column: { connect: { id: parsed.data.columnId } } },
    })
    return Response.json(updated)
  } catch {
    return Response.json({ error: "Erro ao mover todo" }, { status: 500 })
  }
}
