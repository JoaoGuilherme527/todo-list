import { PrismaClient } from "@prisma/client";

const globalForPrismaClient = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrismaClient.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrismaClient.prisma = prisma

export default prisma