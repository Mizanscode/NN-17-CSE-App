import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { notices } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const noticeRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
          pinned: z.boolean().optional(),
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { category, pinned, page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (category) {
        conditions.push(eq(notices.category, category as any));
      }
      if (pinned !== undefined) {
        conditions.push(eq(notices.isPinned, pinned ? 1 : 0));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(notices)
        .where(where)
        .orderBy(desc(notices.isPinned), desc(notices.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(notices)
        .where(where);

      return { notices: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(notices)
        .where(eq(notices.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.enum(["class", "assignment", "exam", "department", "emergency", "seminar"]),
        attachmentUrl: z.string().optional(),
        isPinned: z.number().default(0),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(notices).values({
        ...input,
        authorId: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.enum(["class", "assignment", "exam", "department", "emergency", "seminar"]).optional(),
        isPinned: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(notices).set(data).where(eq(notices.id, id));
      const results = await db.select().from(notices).where(eq(notices.id, id)).limit(1);
      return results[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(notices).where(eq(notices.id, input.id));
      return { success: true };
    }),
});
