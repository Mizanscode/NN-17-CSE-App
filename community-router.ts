import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { communityPosts } from "@db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";

export const communityRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { category, search, page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (category) {
        conditions.push(eq(communityPosts.category, category as any));
      }
      if (search) {
        conditions.push(
          sql`(${communityPosts.title} LIKE ${`%${search}%`} OR ${communityPosts.content} LIKE ${`%${search}%`})`,
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(communityPosts)
        .where(where)
        .orderBy(desc(communityPosts.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(communityPosts)
        .where(where);

      return { posts: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, input.id))
        .limit(1);
      if (results[0]) {
        await db
          .update(communityPosts)
          .set({ views: (results[0].views || 0) + 1 })
          .where(eq(communityPosts.id, input.id));
      }
      return results[0] || null;
    }),

  create: authedQuery
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.enum(["general", "academic", "career", "technical", "social"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(communityPosts).values({
        ...input,
        authorId: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const post = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, input.id))
        .limit(1);

      if (post.length === 0) {
        throw new Error("Post not found");
      }

      const isAuthor = post[0].authorId === ctx.user.id;
      const isAdmin = ctx.user.role === "admin" || ctx.user.role === "super_admin";

      if (!isAuthor && !isAdmin) {
        throw new Error("Unauthorized to delete this post");
      }

      await db.delete(communityPosts).where(eq(communityPosts.id, input.id));
      return { success: true };
    }),
});
