import { relations } from "drizzle-orm";
import {
  users,
  students,
  notices,
  events,
  galleryAlbums,
  galleryItems,
  resources,
  techNews,
  alumni,
  communityPosts,
  eventRegistrations,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  notices: many(notices),
  events: many(events),
  galleryItems: many(galleryItems),
  resources: many(resources),
  techNews: many(techNews),
  communityPosts: many(communityPosts),
  eventRegistrations: many(eventRegistrations),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));

export const noticesRelations = relations(notices, ({ one }) => ({
  author: one(users, {
    fields: [notices.authorId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  registrations: many(eventRegistrations),
}));

export const galleryAlbumsRelations = relations(galleryAlbums, ({ one, many }) => ({
  creator: one(users, {
    fields: [galleryAlbums.createdBy],
    references: [users.id],
  }),
  items: many(galleryItems),
}));

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
  album: one(galleryAlbums, {
    fields: [galleryItems.albumId],
    references: [galleryAlbums.id],
  }),
  uploader: one(users, {
    fields: [galleryItems.uploadedBy],
    references: [users.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  uploader: one(users, {
    fields: [resources.uploadedBy],
    references: [users.id],
  }),
}));

export const techNewsRelations = relations(techNews, ({ one }) => ({
  creator: one(users, {
    fields: [techNews.createdBy],
    references: [users.id],
  }),
}));

export const alumniRelations = relations(alumni, ({ one }) => ({
  user: one(users, {
    fields: [alumni.userId],
    references: [users.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one }) => ({
  author: one(users, {
    fields: [communityPosts.authorId],
    references: [users.id],
  }),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
  }),
}));
