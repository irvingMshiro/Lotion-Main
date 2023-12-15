"use client"

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps{
    params:{
        documentId: Id<"documents">
    }
}

const DocumentIdPage = ({
    params
}: DocumentIdPageProps) => {
    const Editor = useMemo(()=>dynamic(()=>import("@/components/editor"), {ssr: false}) ,[])

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    })

    const update = useMutation(api.documents.update)

    const onChange = (content: string)=>{
        update({
            id: params.documentId,
            content
        })
    }

    if(document === undefined){
        return(
            <div>
                <Cover.Skeleton/>
                <div className="md:max-w-3xl lg:max-w-4xl ml-6 mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]"/>
                        <Skeleton className="h-14 w-[80%]"/>
                        <Skeleton className="h-14 w-[40%]"/>
                        <Skeleton className="h-14 w-[60%]"/>
                    </div>
                </div>
            </div>
        )
    }

    if(document === null){
        return(
            <div>
                not found
            </div>
        )
    }

    return ( 
        <div className="pb-40">
            <Cover preview url={document.coverImage}/>
            <div className="md:max-w-10xl lg:md-max-w-11xl mx-auto">
                <Toolbar preview initialData={document}/>
                <Editor
                    editable={false}
                    onChange={onChange}
                    initialContent={document.content}
                />
            </div>
        </div>
     );
}
 
export default DocumentIdPage;