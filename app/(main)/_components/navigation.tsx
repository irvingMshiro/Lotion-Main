"use client"

import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, PlusCircle, Search, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { UserItem } from "./user-item"
import {useMutation} from "convex/react"
import { api } from "@/convex/_generated/api"
import { Item } from "./item"
import {toast} from "sonner"
import { DocumentList } from "./Docoment-list"
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover"
import { TrashBox } from "./trash-box"
import { useSearch } from "@/hooks/use-search"
import { Navbar } from "./navbar"

export const Navigation = ()=>{
    const search = useSearch()
    const params = useParams()
    const pathname = usePathname()
    const isMobile = useMediaQuery("(max-width: 768px")
    const create = useMutation(api.documents.create)
    const router = useRouter()

    const sidebarRef = useRef<ElementRef<"aside">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)

    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    useEffect(()=>{
        if(isMobile){
            collapse()
        }
        else{
            resetWidth()
        }
    }, [isMobile])

    useEffect(()=>{
        if(isMobile){
            collapse()
        }
    }, [pathname, isMobile])

    const resetWidth = ()=>{
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(false)

            sidebarRef.current.style.width = isMobile ? "100%" : "240px"
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)")
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px")
        }
    }

    const collapse = ()=>{
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(true)

            sidebarRef.current.style.width = "0"
            navbarRef.current.style.setProperty("width", "100%")
            navbarRef.current.style.setProperty("left", "0")
        }
    }

    // buat bikin data baru
    const handleCreate = ()=>{
        const promise = create({title: "Untitled"})
        .then((documentId)=>router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        })
    }

    return(
        <>
            <aside ref={sidebarRef} className={cn(
                "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-999",
                isMobile && "w-0"
                )}
            >
                <div
                    onClick={collapse}
                    role="button"                                                                       // Button to collapse the navbar
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >  
                    <ChevronsLeft className="h-6 w-6"  />
                </div>
                <div>
                    <UserItem />                                                           {   /*  User Profile  */}    
                    <Item onClick={search.onOpen} label="Search" icon={Search} isSearch/>              
                    <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
                </div>
                <div className="mt-2">
                    <DocumentList/>
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash}/>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" side={isMobile? "bottom":"right"}>
                            <TrashBox/>
                        </PopoverContent>
                    </Popover>
                </div>
            </aside>
            
            <div ref={navbarRef} className={cn(
                "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isMobile && "left-0 w-full"
            )}
            >
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ):(
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground"/>}
                    </nav>
                )}
            </div>
        </>
    )
}