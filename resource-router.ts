import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { resources } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const resourceRouter = createRouter({
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
        conditions.push(eq(resources.category, category as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(resources)
        .where(where)
        .orderBy(desc(resources.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(resources)
        .where(where);

      return { resources: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(resources)
        .where(eq(resources.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  incrementDownloads: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const current = await db
        .select()
        .from(resources)
        .where(eq(resources.id, input.id))
        .limit(1);
      if (current[0]) {
        await db
          .update(resources)
          .set({ downloads: (current[0].downloads || 0) + 1 })
          .where(eq(resources.id, input.id));
      }
      return { downloads: (current[0]?.downloads || 0) + 1 };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.enum([
          "course_materials",
          "pdf_notes",
          "previous_questions",
          "programming_books",
          "lecture_slides",
          "assignments",
          "lab_reports",
          "research_papers",
        ]),
        fileUrl: z.string(),
        fileType: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(resources).values({
        ...input,
        uploadedBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(resources).where(eq(resources.id, input.id));
      return { success: true };
    }),
});
