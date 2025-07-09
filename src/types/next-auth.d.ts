import { Column, Project, TodoItem, User } from "@prisma/client";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface AppProject extends Project {
    owner: User
    columns: AppColumn[]
  }

  interface AppColumn extends Column {
    id: string
    name: string
    color: string
    todos?: AppTodoItem[]
    projectId: string
  }

  interface AppTodoItem extends TodoItem {
    id: string
    name: string
    startAt: Date
    endAt: Date
    columnId: string
    ownerId: string
    owner: User
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
