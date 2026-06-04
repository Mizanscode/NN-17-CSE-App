import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { studentRouter } from "./student-router";
import { noticeRouter } from "./notice-router";
import { eventRouter } from "./event-router";
import { galleryRouter } from "./gallery-router";
import { resourceRouter } from "./resource-router";
import { techNewsRouter } from "./tech-news-router";
import { alumniRouter } from "./alumni-router";
import { communityRouter } from "./community-router";
import { dashboardRouter } from "./dashboard-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  student: studentRouter,
  notice: noticeRouter,
  event: eventRouter,
  gallery: galleryRouter,
  resource: resourceRouter,
  techNews: techNewsRouter,
  alumni: alumniRouter,
  community: communityRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
