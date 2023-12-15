"use client"

import { useParams, useRouter } from "next/navigation"
import {useQuery} from "convex/react"
import { api } from "@/convex/_generated/api"
import { Item } from "./item"
import { FileIcon } from "lucide-react"

export const DocumentList = ()=>{
    const params = useParams()
    const router = useRouter()

    const documents = useQuery(api.documents.getSideBar, {})

    const onRedirect = (documentId: string)=>{
        router.push(`/documents/${documentId}`)
    }

    return(
        <>
            {documents?.map((document)=>(
                <div key={document._id} className="ml-3">
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={params.documentId === document._id}
                    />
                </div>
            ))}
        </>
    )
}