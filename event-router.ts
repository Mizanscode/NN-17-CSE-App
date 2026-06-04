import { z } from "zod";
import { createRouter, publicQuery, adminQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { events, eventRegistrations } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const eventRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          type: z.string().optional(),
          upcoming: z.boolean().optional(),
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { type, page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (type) {
        conditions.push(eq(events.eventType, type as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(events)
        .where(where)
        .orderBy(desc(events.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db.select({ count: count() }).from(events).where(where);

      return { events: results, total: totalResult[0]?.count || 0 };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        eventType: z.enum(["workshop", "seminar", "hackathon", "contest", "department_program"]),
        startDate: z.string(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        imageUrl: z.string().optional(),
        maxAttendees: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(events).values({
        ...input,
        createdBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  register: authedQuery
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.insert(eventRegistrations).values({
        eventId: input.eventId,
        userId: ctx.user.id,
        status: "registered",
      });
      return { success: true };
    }),

  getRegistrations: authedQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.eventId, input.eventId));
      return { registrations: results, count: results.length };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),
});
