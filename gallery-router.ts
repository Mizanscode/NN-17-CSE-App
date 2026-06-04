import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { galleryAlbums, galleryItems } from "@db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const galleryRouter = createRouter({
  listAlbums: publicQuery.query(async () => {
    const db = getDb();
    const results = await db.select().from(galleryAlbums).orderBy(desc(galleryAlbums.createdAt));
    return results;
  }),

  listItems: publicQuery
    .input(
      z
        .object({
          albumId: z.number().optional(),
          category: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(12),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { albumId, category, page = 1, limit = 12 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (albumId) {
        conditions.push(eq(galleryItems.albumId, albumId));
      }
      if (category) {
        conditions.push(eq(galleryItems.category, category as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(galleryItems)
        .where(where)
        .orderBy(desc(galleryItems.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(galleryItems)
        .where(where);

      return { items: results, total: totalResult[0]?.count || 0 };
    }),

  createAlbum: adminQuery
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        coverImageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(galleryAlbums).values({
        ...input,
        createdBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  uploadItem: adminQuery
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.enum([
          "batch_events",
          "university_programs",
          "seminars",
          "workshops",
          "study_tours",
          "memories",
        ]),
        imageUrl: z.string(),
        albumId: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(galleryItems).values({
        ...input,
        uploadedBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId), ...input };
    }),

  deleteItem: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(galleryItems).where(eq(galleryItems.id, input.id));
      return { success: true };
    }),
});
