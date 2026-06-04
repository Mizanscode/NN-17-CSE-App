import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "nexul17-secret-key-change-in-production";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        fullName: z.string().min(2),
        role: z.enum(["student", "alumni"]).optional().default("student"),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const result = await db.insert(users).values({
        email: input.email,
        name: input.fullName,
        passwordHash,
        role: input.role,
        unionId: `local_${Date.now()}`,
      });

      const userId = Number((result as any).insertId);
      const token = jwt.sign({ userId, email: input.email, role: input.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return {
        token,
        user: {
          id: userId,
          email: input.email,
          name: input.fullName,
          role: input.role,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (results.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = results[0];
      if (!user.passwordHash) {
        throw new Error("Please use OAuth login");
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  meLocal: publicQuery.query(async ({ ctx }) => {
    const authHeader =
      ctx.req.headers.get("x-local-auth-token") ||
      ctx.req.headers.get("authorization")?.replace("Bearer ", "");

    if (!authHeader) return null;

    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET) as any;
      const db = getDb();
      const results = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (results.length === 0) return null;
      return results[0];
    } catch {
      return null;
    }
  }),
});
