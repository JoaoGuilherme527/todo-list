"use client"

import LoginButtons from "@/components/LoginButtons"
import {Button} from "@/components/ui/button"
import {signOut} from "next-auth/react"

export default function Login() {
    return (
        <div className="bg-primary-foreground">
            <LoginButtons />
        </div>
    )
}
