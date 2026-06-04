import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { techNews } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const techNewsRouter = createRouter({
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
      const { category, page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (category) {
        conditions.push(eq(techNews.category, category as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(techNews)
        .where(where)
        .orderBy(desc(techNews.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(techNews)
        .where(where);

      return { articles: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(techNews)
        .where(eq(techNews.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  incrementViews: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const current = await db
        .select()
        .from(techNews)
        .where(eq(techNews.id, input.id))
        .limit(1);
      if (current[0]) {
        await db
          .update(techNews)
          .set({ views: (current[0].views || 0) + 1 })
          .where(eq(techNews.id, input.id));
      }
      return { views: (current[0]?.views || 0) + 1 };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string(),
        summary: z.string(),
        content: z.string().optional(),
        category: z.enum([
          "ai",
          "machine_learning",
          "cyber_security",
          "programming",
          "software_engineering",
          "cloud_computing",
          "robotics",
          "startups",
          "data_science",
        ]),
        imageUrl: z.string().optional(),
        sourceUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(techNews).values({
        ...input,
        createdBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(techNews).where(eq(techNews.id, input.id));
      return { success: true };
    }),
});
