import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  users,
  students,
  notices,
  events,
  resources,
  galleryItems,
  techNews,
  alumni,
  communityPosts,
} from "@db/schema";
import { count, desc } from "drizzle-orm";

export const dashboardRouter = createRouter({
  getStats: adminQuery.query(async () => {
    const db = getDb();

    const [
      totalUsers,
      totalStudents,
      totalNotices,
      totalEvents,
      totalResources,
      totalGalleryItems,
      totalTechNews,
      totalAlumni,
      totalCommunityPosts,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(students),
      db.select({ count: count() }).from(notices),
      db.select({ count: count() }).from(events),
      db.select({ count: count() }).from(resources),
      db.select({ count: count() }).from(galleryItems),
      db.select({ count: count() }).from(techNews),
      db.select({ count: count() }).from(alumni),
      db.select({ count: count() }).from(communityPosts),
    ]);

    const recentNotices = await db
      .select()
      .from(notices)
      .orderBy(desc(notices.createdAt))
      .limit(5);

    const recentEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(5);

    const roleDistribution = await db
      .select({ role: users.role, count: count() })
      .from(users)
      .groupBy(users.role);

    return {
      totalUsers: totalUsers[0]?.count || 0,
      totalStudents: totalStudents[0]?.count || 0,
      totalNotices: totalNotices[0]?.count || 0,
      totalEvents: totalEvents[0]?.count || 0,
      totalResources: totalResources[0]?.count || 0,
      totalGalleryItems: totalGalleryItems[0]?.count || 0,
      totalTechNews: totalTechNews[0]?.count || 0,
      totalAlumni: totalAlumni[0]?.count || 0,
      totalCommunityPosts: totalCommunityPosts[0]?.count || 0,
      recentNotices,
      recentEvents,
      roleDistribution,
    };
  }),
});
