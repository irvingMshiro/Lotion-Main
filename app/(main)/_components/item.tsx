"use client"

import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Copy, LucideIcon, MoreHorizontal, Trash } from "lucide-react"
import {useMutation} from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import {toast} from "sonner"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ItemProps{
    id?: Id<"documents">
    documentIcon?: string
    active?: boolean
    isSearch?: boolean
    label: string
    onClick?: ()=> void
    icon: LucideIcon
}

export const Item = ({
    id, label, onClick, icon: Icon, active, documentIcon
}: ItemProps)=>{
    const router = useRouter()
    const archive = useMutation(api.documents.archive)
    const duplicate = useMutation(api.documents.duplicate)

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
      ) => {
        event.stopPropagation();

        if (!id) return;
        const promise = archive({ id }).then(() => router.push("/documents"))                               // archive/delete function
    
        toast.promise(promise, {
          loading: "Moving to trash...",
          success: "Note moved to trash!",
          error: "Failed to archive note."
        });
    };

    const onDuplicate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    )=>{
        event.stopPropagation()
        if(!id) return

        const promise = duplicate({id})
        .then((documentId)=>router.push(`/documents/${documentId}`))

        toast.promise(promise,{
            loading: "Duplicating...",
            success: "Note has been duplicated!",
            error: "Failed to duplicate note."
        })
    }

    return(
        <div
            onClick={onClick}
            role="button"
            style={{
                paddingLeft: "12px"
            }}
            className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                            active && "bg-primary/5 text-primary")}>
            
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}                                  {/*   show documentIcon kalau dimasukin    */}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground ml-1" />      // show default icon if gaada 
            )}

            <span className="truncate">
                {label}
            </span>

            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e)=>e.stopPropagation()} >
                            <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
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
                </div>
            )}
        </div>
    )
}