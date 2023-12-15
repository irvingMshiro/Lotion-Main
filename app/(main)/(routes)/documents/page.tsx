"use client"

import Image from "next/image";
import {useUser} from "@clerk/clerk-react"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {useMutation} from "convex/react"
import { api } from "@/convex/_generated/api";
import {toast} from "sonner"
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const DocumentsPage = () => {
    const {user} = useUser()
    const create = useMutation(api.documents.create)
    const router = useRouter()

    const onCreate = () =>{
        const promise = create({ title: "Untitled" })
        .then((documentId)=>router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        })
    }

    return (
        <>
            <div className="h-full flex flex-col items-center justify-center
            space-y-4"
            >
                <div className="absolute top-0 right-0 px-3 py-2">
                    <ModeToggle/>
                </div>
                <Image src="/main-page.png" height="300" width="300" alt="empty" className="dark:hidden" />
                <Image src="/main-page-dark.png" height="300" width="300" alt="empty" className="hidden dark:block" />
                <h2 className="text-lf font-medium">
                    Welcome to {user?.firstName}&apos;s Notes
                </h2>
                <Button onClick={onCreate}>
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Create a note
                </Button>
            </div>
        </>
     );
}
 
export default DocumentsPage;