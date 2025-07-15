'use client'

import {EllipsisIcon, Trash2Icon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Input} from "./ui/input"
import { useAppContext } from "@/context/AppProvider";

export default function EditDropDownMenu({id, action}: {id: string; action: any}) {
    const {refreshLoad} = useAppContext()
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full shadow-none cursor-pointer" aria-label="Open edit menu">
                        <EllipsisIcon size={16} aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <form action={action} onSubmit={refreshLoad} >
                    <DropdownMenuItem>
                        <Input id="id" name="id" type="text" defaultValue={id} hidden readOnly/>
                        <button type="submit" className="cursor-pointer text-red-500 font-bold flex justify-between w-full items-center" >
                            <span>Delete</span>
                            <Trash2Icon size={16} aria-hidden="true" />
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
