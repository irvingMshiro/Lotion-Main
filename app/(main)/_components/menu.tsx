"use client"

import { Id } from "@/convex/_generated/dataModel"
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy, MoreHorizontal, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProps{
    documentId: Id<"documents">
}

export const Menu = ({
    documentId
}: MenuProps)=>{
    const router = useRouter()
    const archive = useMutation(api.documents.archive)
    const duplicate = useMutation(api.documents.duplicate)
    
    const onArchive = ()=>{
        const promise = archive({id: documentId})

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note."
        })
        router.push("/documents")
    }

    const onDuplicate = () =>{
        const promise = duplicate({id: documentId})
        .then((documentId)=>router.push(`/documents/${documentId}`))
        
        toast.promise(promise,{
            loading: "Duplicating...",
            success: "Note has been duplicated!",
            error: "Failed to duplicate note."
        })
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="h-4 w-4 mr-2"/>
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton(){
    return(
        <Skeleton className="h-10 w-10" />
    )
}