"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Share2 } from "lucide-react";

interface PublishProps{
    initialData: Doc<"documents">
}

export const Publish = ({
    initialData
}: PublishProps)=>{

    const origin = useOrigin();
    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState(false);                            // clipboard link document
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;     

    const onPublish = ()=>{
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: true,  
        })
            .finally(()=>setIsSubmitting(false));

        toast.promise(promise,{
            loading: "Publishing....",
            success: "Note Published",
            error: "Failed to publish",
        })
    }

    const onUnPublish = ()=>{
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
            .finally(()=>setIsSubmitting(false));

        toast.promise(promise,{
            loading: "Unpublishing....",
            success: "Note Unpublished",
            error: "Failed to unpublish",
        })  
    }

    const onCopy = ()=>{
        navigator.clipboard.writeText(url);                                 // after copied link
        setCopied(true);

        setTimeout(()=>{
            setCopied(false);
        }, 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost">
                    {initialData.isPublished ? (
                        <>
                            <p className="text-sky-600">Shared</p>               
                        </>
                        ) : (
                        <>
                            <p className="text-slate-500">Share</p>
                            {/* <Share2 className="h-4 w-4 ml-1"/> */}
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80" align="end" alignOffset={8} forceMount>
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <p className="text-xs font-medium text-sky-500"> Share your Note by Copying the Link</p>
                        </div>

                        <div className="flex items-center">
                            <input className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate" value={url} disabled />
                            <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <Button size="sm" className="w-full text-xs" disabled={isSubmitting}  onClick={onUnPublish}>

                            Stop Sharing
                        </Button>
                    </div>
                ):(
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium mb-2"> Share your Note </p>

                        {/* <span className="text-xs text-muted-foreground mb-4"> Share your work with others. </span>   */}

                        <Button disabled={isSubmitting} onClick={onPublish} className="w-full text-xs" size="sm">
                            Start Sharing
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}