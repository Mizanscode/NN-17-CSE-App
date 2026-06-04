import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users ──────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["super_admin", "admin", "moderator", "student", "alumni"])
    .default("student")
    .notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Students ───────────────────────────────────────────────
export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  studentId: varchar("studentId", { length: 50 }).notNull().unique(),
  rollNumber: varchar("rollNumber", { length: 50 }).notNull().unique(),
  registrationNumber: varchar("registrationNumber", { length: 50 }).notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  batch: varchar("batch", { length: 100 }).notNull(),
  session: varchar("session", { length: 50 }).notNull(),
  department: varchar("department", { length: 50 }).notNull(),
  bloodGroup: varchar("bloodGroup", { length: 10 }),
  gender: varchar("gender", { length: 20 }),
  district: varchar("district", { length: 100 }),
  upazila: varchar("upazila", { length: 100 }),
  presentAddress: text("presentAddress"),
  permanentAddress: text("permanentAddress"),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  facebookUrl: text("facebookUrl"),
  linkedinUrl: text("linkedinUrl"),
  githubUrl: text("githubUrl"),
  portfolioUrl: text("portfolioUrl"),
  skills: text("skills"),
  interests: text("interests"),
  programmingLanguages: text("programmingLanguages"),
  projects: text("projects"),
  certifications: text("certifications"),
  profilePicture: text("profilePicture"),
  coverPhoto: text("coverPhoto"),
  resumeUrl: text("resumeUrl"),
  isPublic: int("isPublic").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Student = typeof students.$inferSelect;

// ─── Notices ────────────────────────────────────────────────
export const notices = mysqlTable("notices", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", [
    "class",
    "assignment",
    "exam",
    "department",
    "emergency",
    "seminar",
  ]).notNull(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }).notNull(),
  attachmentUrl: text("attachmentUrl"),
  isPinned: int("isPinned").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notice = typeof notices.$inferSelect;

// ─── Events ─────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  eventType: mysqlEnum("eventType", [
    "workshop",
    "seminar",
    "hackathon",
    "contest",
    "department_program",
  ]).notNull(),
  startDate: varchar("startDate", { length: 50 }).notNull(),
  endDate: varchar("endDate", { length: 50 }),
  location: varchar("location", { length: 255 }),
  imageUrl: text("imageUrl"),
  maxAttendees: int("maxAttendees"),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;

// ─── Gallery Albums ─────────────────────────────────────────
export const galleryAlbums = mysqlTable("gallery_albums", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;

// ─── Gallery Items ──────────────────────────────────────────
export const galleryItems = mysqlTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "batch_events",
    "university_programs",
    "seminars",
    "workshops",
    "study_tours",
    "memories",
  ]).notNull(),
  imageUrl: text("imageUrl").notNull(),
  albumId: bigint("albumId", { mode: "number", unsigned: true }),
  uploadedBy: bigint("uploadedBy", { mode: "number", unsigned: true }).notNull(),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;

// ─── Resources ──────────────────────────────────────────────
export const resources = mysqlTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "course_materials",
    "pdf_notes",
    "previous_questions",
    "programming_books",
    "lecture_slides",
    "assignments",
    "lab_reports",
    "research_papers",
  ]).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileType: varchar("fileType", { length: 20 }),
  downloads: int("downloads").default(0),
  uploadedBy: bigint("uploadedBy", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;

// ─── Tech News ──────────────────────────────────────────────
export const techNews = mysqlTable("tech_news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  category: mysqlEnum("category", [
    "ai",
    "machine_learning",
    "cyber_security",
    "programming",
    "software_engineering",
    "cloud_computing",
    "robotics",
    "startups",
    "data_science",
  ]).notNull(),
  imageUrl: text("imageUrl"),
  sourceUrl: text("sourceUrl"),
  views: int("views").default(0),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TechNews = typeof techNews.$inferSelect;

// ─── Alumni ─────────────────────────────────────────────────
export const alumni = mysqlTable("alumni", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  graduationYear: varchar("graduationYear", { length: 20 }).notNull(),
  currentCompany: varchar("currentCompany", { length: 255 }),
  jobPosition: varchar("jobPosition", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  email: varchar("email", { length: 320 }),
  linkedinUrl: text("linkedinUrl"),
  bio: text("bio"),
  profilePicture: text("profilePicture"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alumni = typeof alumni.$inferSelect;

// ─── Community Posts ────────────────────────────────────────
export const communityPosts = mysqlTable("community_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", [
    "general",
    "academic",
    "career",
    "technical",
    "social",
  ]).notNull(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }).notNull(),
  likes: int("likes").default(0),
  views: int("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;

// ─── Event Registrations ────────────────────────────────────
export const eventRegistrations = mysqlTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["registered", "attended", "cancelled"])
    .default("registered")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
