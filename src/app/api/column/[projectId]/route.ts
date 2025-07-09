import { prisma } from "@/index"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  if (!projectId) {
    return Response.json({ error: "Project ID não fornecido" }, { status: 400 })
  }

  try {
    const columns = await prisma.column.findMany({
      where: {
        projectId,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        todos: true,
      },
    })

    return Response.json(columns)
  } catch (err) {
    console.error("Erro ao buscar colunas por projeto:", err)
    return Response.json({ error: "Erro ao buscar colunas" }, { status: 500 })
  }
}
