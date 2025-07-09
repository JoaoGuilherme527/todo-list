import { z } from "zod"

export const projectCreateSchema = z.object({
    name: z.string().min(2, "Nome do projeto obrigatório"),
})

export const projectUpdateSchema = z.object({
    id: z.string().cuid("ID inválido"),
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
})

export type ProjectFormData = z.infer<typeof projectCreateSchema>
