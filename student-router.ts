import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { students } from "@db/schema";
import { eq, and, sql, count } from "drizzle-orm";

export const studentRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          department: z.string().optional(),
          batch: z.string().optional(),
          skills: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(12),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, department, batch, page = 1, limit = 12 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (search) {
        conditions.push(
          sql`(${students.fullName} LIKE ${`%${search}%`} OR ${students.studentId} LIKE ${`%${search}%`} OR ${students.rollNumber} LIKE ${`%${search}%`})`,
        );
      }
      if (department) {
        conditions.push(eq(students.department, department));
      }
      if (batch) {
        conditions.push(eq(students.batch, batch));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(students)
        .where(where)
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(students)
        .where(where);

      return {
        students: results,
        total: totalResult[0]?.count || 0,
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  getByStudentId: publicQuery
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(students)
        .where(eq(students.studentId, input.studentId))
        .limit(1);
      return results[0] || null;
    }),

  getStats: publicQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ count: count() }).from(students);
    const total = totalResult[0]?.count || 0;

    return {
      totalStudents: total,
      activeMembers: total,
      byDepartment: [{ department: "CSE", count: total }],
      byBatch: [{ batch: "Neural Nexul-17", count: total }],
    };
  }),

  create: adminQuery
    .input(
      z.object({
        studentId: z.string(),
        rollNumber: z.string(),
        registrationNumber: z.string(),
        fullName: z.string(),
        batch: z.string(),
        session: z.string(),
        department: z.string(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
        skills: z.string().optional(),
        programmingLanguages: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(students).values(input);
      const id = Number((result as any).insertId);
      return { id, ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
        skills: z.string().optional(),
        programmingLanguages: z.string().optional(),
        facebookUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
        district: z.string().optional(),
        upazila: z.string().optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        bloodGroup: z.string().optional(),
        gender: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(students).set(data).where(eq(students.id, id));
      const results = await db
        .select()
        .from(students)
        .where(eq(students.id, id))
        .limit(1);
      return results[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),
});
