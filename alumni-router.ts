import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { alumni } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const alumniRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          industry: z.string().optional(),
          graduationYear: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(12),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { industry, graduationYear, page = 1, limit = 12 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (industry) {
        conditions.push(eq(alumni.industry, industry));
      }
      if (graduationYear) {
        conditions.push(eq(alumni.graduationYear, graduationYear));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(alumni)
        .where(where)
        .orderBy(desc(alumni.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(alumni)
        .where(where);

      return { alumni: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(alumni)
        .where(eq(alumni.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        fullName: z.string(),
        graduationYear: z.string(),
        currentCompany: z.string().optional(),
        jobPosition: z.string().optional(),
        industry: z.string().optional(),
        email: z.string().email().optional(),
        linkedinUrl: z.string().optional(),
        bio: z.string().optional(),
        profilePicture: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(alumni).values(input);
      return { id: Number((result as any).insertId), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        currentCompany: z.string().optional(),
        jobPosition: z.string().optional(),
        industry: z.string().optional(),
        linkedinUrl: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(alumni).set(data).where(eq(alumni.id, id));
      const results = await db.select().from(alumni).where(eq(alumni.id, id)).limit(1);
      return results[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(alumni).where(eq(alumni.id, input.id));
      return { success: true };
    }),
});
