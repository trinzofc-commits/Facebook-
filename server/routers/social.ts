import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const socialRouter = router({
  // Get feed posts
  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const posts = await db.getFeedPosts(input.limit, input.offset);
        
        // In a real app, we'd use join to get user info. 
        // For now, let's enrich with user data manually if needed or assume client handles it.
        // The current db.ts doesn't have join, so we'll just return posts.
        return posts;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch feed",
        });
      }
    }),

  // Create a new post
  createPost: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        content: z.string().optional(),
        images: z.array(z.string()).optional(),
        visibility: z.string().default("public"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const post = await db.createPost(input);
        return post;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }
    }),

  // Like a post
  likePost: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        postId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const like = await db.addLike({
          userId: input.userId,
          postId: input.postId,
          reactionType: "like",
        });
        return like;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to like post",
        });
      }
    }),

  // Get comments for a post
  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await db.getCommentsByPostId(input.postId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch comments",
        });
      }
    }),

  // Add a comment
  addComment: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await db.createComment(input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add comment",
        });
      }
    }),
});
