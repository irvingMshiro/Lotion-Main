import {v} from "convex/values"
import{mutation, query} from "./_generated/server"
import { Doc } from "./_generated/dataModel"

export const getSideBar = query({
    handler:  async (ctx)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q)=>q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect()
            
        return documents                    
    }
})

export const create = mutation({
    args:{
        title: v.string(),
    },
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const document = await ctx.db.insert("documents", {
            title: args.title,
            userId,
            isArchived: false,
            isPublished: false,
        })
        
        return document
    }
})

export const getTrash = query({
    handler: async(ctx)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q)=>q.eq("userId", userId))
            .filter((q)=>
                q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect()

        return documents
    }
})

export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
  
      const options: Partial<Doc<"documents">> = {
        isArchived: false,
      };
  
      const document = await ctx.db.patch(args.id, options);
  
      return document;
    }
  });

  export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
  
      const document = await ctx.db.delete(args.id);
  
      return document;
    }
  });

export const getSearch = query({
    handler:async (ctx)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q)=>q.eq("userId", userId))
            .filter((q)=>q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect()
        
        return documents
    }
})

export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
        throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
        return document;
    }

    if (!identity) {
        throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return document;
    }
});

export const update = mutation({
    args:{
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },
    handler: async (ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const {id, ...rest} = args

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }

        const document = await ctx.db.patch(args.id, {
            ...rest
        })
        
        return document
    }
})

export const archive = mutation({
    args: {id: v.id("documents")},
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }


        const document = await ctx.db.patch(args.id, {isArchived: true})

        return document
    }
})

export const duplicate = mutation({
    args: {id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject
        
        const clone = await ctx.db.get(args.id);

        if (!clone) {
            throw new Error("Task not found");
        }

        const duplicatedData = await ctx.db.insert("documents", {
            title: clone.title,
            userId,
            isArchived: false,
            isPublished: false,
            content: clone.content,
            coverImage: clone.coverImage,
            icon: clone.icon
        });
    
        return duplicatedData;
    },
});

export const removeIcon = mutation({
    args:{ id: v.id("documents")},
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }

        const document = await ctx.db.patch(args.id, {
            icon: undefined
        })

        return document
    }
})

export const removeCoverImage = mutation({
    args:{id: v.id("documents")},
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }

        const document = await ctx.db.patch(args.id, {coverImage: undefined})

        return document
    }
})