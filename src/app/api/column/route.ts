import { prisma } from "@/index"
import { z } from "zod"
import { NextRequest } from "next/server"

const columnSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color must be in hexadecimal format"),
  projectId: z.string().cuid("Invalid projectId"),
})

const columnUpdateSchema = z
  .object({
    id: z.string().cuid("Invalid ID"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color must be in hexadecimal format").optional(),
  })
  .refine((data) => data.name || data.color, {
    message: "At least one of 'name' or 'color' must be provided",
  })

// ➕ Create column
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = columnSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, color, projectId } = parsed.data

  try {
    const existing = await prisma.column.findFirst({
      where: {
        projectId,
        OR: [{ name }, { color }],
      },
    })

    if (existing) {
      return Response.json({
        error: `A column with the same ${existing.name === name ? "name" : "color"} already exists.`,
      }, { status: 409 })
    }

    const column = await prisma.column.create({ data: parsed.data })
    return Response.json(column, { status: 201 })

  } catch (err) {
    console.error("Error creating column:", err)
    return Response.json({ error: "Error creating column" }, { status: 500 })
  }
}

// 📄 Get all columns (for admin or debug purposes)
export async function GET() {
  try {
    const columns = await prisma.column.findMany({
      orderBy: { name: "asc" },
      include: {
        todos: true,
        project: true,
      },
    })
    return Response.json(columns)
  } catch (err) {
    console.error("Error fetching columns:", err)
    return Response.json({ error: "Error fetching columns" }, { status: 500 })
  }
}

// ✏️ Update column (name and/or color)
export async function PATCH(req: Request) {
  const body = await req.json()
  const parsed = columnUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const updated = await prisma.column.update({
      where: { id: parsed.data.id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.color && { color: parsed.data.color }),
      },
    })
    return Response.json(updated)
  } catch (err) {
    console.error("Error updating column:", err)
    return Response.json({ error: "Error updating column" }, { status: 500 })
  }
}


// ❌ Delete column
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id || !z.string().cuid().safeParse(id).success) {
    return Response.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    await prisma.column.delete({ where: { id } })
    return Response.json({ message: "Column deleted" }, { status: 200 })
  } catch (err) {
    console.error("Error deleting column:", err)
    return Response.json({ error: "Error deleting column" }, { status: 500 })
  }
}
