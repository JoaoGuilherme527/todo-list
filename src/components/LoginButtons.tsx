"use client"
import {Button} from "@/components/ui/button"
import {signIn} from "next-auth/react"
import {IconBrandGoogleFilled} from "@tabler/icons-react"

function AuthButton() {
    return (
        <Button onClick={() => signIn("google")} variant="outline" className="bg-zinc-950 text-white cursor-pointer" size="sm">
            <IconBrandGoogleFilled /> Login with Google
        </Button>
    )
}

export default function LoginButtons() {
    return <AuthButton />
}
