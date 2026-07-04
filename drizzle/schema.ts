import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  varchar,
  jsonb,
  foreignKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatar: text("avatar"),
    coverPhoto: text("cover_photo"),
    bio: text("bio"),
    birthDate: timestamp("birth_date"),
    gender: varchar("gender", { length: 20 }),
    phone: varchar("phone", { length: 20 }),
    location: varchar("location", { length: 255 }),
    website: varchar("website", { length: 255 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  })
);

// Posts table
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    images: jsonb("images"), // Array of image URLs
    videos: jsonb("videos"), // Array of video URLs
    visibility: varchar("visibility", { length: 20 }).default("public"), // public, friends, private
    likes: integer("likes").default(0),
    commentsCount: integer("comments_count").default(0),
    sharesCount: integer("shares_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("posts_user_id_idx").on(table.userId),
    createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  })
);

// Comments table
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    likes: integer("likes").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdIdx: index("comments_post_id_idx").on(table.postId),
    userIdIdx: index("comments_user_id_idx").on(table.userId),
  })
);

// Likes table
export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: integer("comment_id").references(() => comments.id, { onDelete: "cascade" }),
    reactionType: varchar("reaction_type", { length: 20 }).default("like"), // like, love, haha, wow, sad, angry
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("likes_user_id_idx").on(table.userId),
    postIdIdx: index("likes_post_id_idx").on(table.postId),
    commentIdIdx: index("likes_comment_id_idx").on(table.commentId),
  })
);

// Friends table
export const friends = pgTable(
  "friends",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: integer("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, blocked
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("friends_user_id_idx").on(table.userId),
    friendIdIdx: index("friends_friend_id_idx").on(table.friendId),
  })
);

// Messages table
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    senderId: integer("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: integer("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
    recipientIdIdx: index("messages_recipient_id_idx").on(table.recipientId),
    createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
  })
);

// Notifications table
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorId: integer("actor_id").references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(), // like, comment, friend_request, message
    relatedPostId: integer("related_post_id").references(() => posts.id, { onDelete: "cascade" }),
    relatedCommentId: integer("related_comment_id").references(() => comments.id, { onDelete: "cascade" }),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
  })
);

// Stories table
export const stories = pgTable(
  "stories",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    image: text("image"),
    video: text("video"),
    expiresAt: timestamp("expires_at").notNull(),
    viewedBy: jsonb("viewed_by"), // Array of user IDs who viewed
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("stories_user_id_idx").on(table.userId),
    expiresAtIdx: index("stories_expires_at_idx").on(table.expiresAt),
  })
);

// Groups table
export const groups = pgTable(
  "groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: text("image"),
    createdBy: integer("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    privacy: varchar("privacy", { length: 20 }).default("public"), // public, private
    memberCount: integer("member_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    createdByIdx: index("groups_created_by_idx").on(table.createdBy),
  })
);

// Group members table
export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).default("member"), // admin, moderator, member
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdIdx: index("group_members_group_id_idx").on(table.groupId),
    userIdIdx: index("group_members_user_id_idx").on(table.userId),
  })
);

// Marketplace items table
export const marketplaceItems = pgTable(
  "marketplace_items",
  {
    id: serial("id").primaryKey(),
    sellerId: integer("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(), // in cents
    images: jsonb("images"), // Array of image URLs
    category: varchar("category", { length: 100 }),
    condition: varchar("condition", { length: 50 }), // new, like_new, used
    location: varchar("location", { length: 255 }),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    sellerIdIdx: index("marketplace_items_seller_id_idx").on(table.sellerId),
    createdAtIdx: index("marketplace_items_created_at_idx").on(table.createdAt),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  friendsInitiated: many(friends, { relationName: "userFriends" }),
  friendsReceived: many(friends, { relationName: "friendUser" }),
  messagesSent: many(messages, { relationName: "senderMessages" }),
  messagesReceived: many(messages, { relationName: "recipientMessages" }),
  notifications: many(notifications),
  stories: many(stories),
  groupsCreated: many(groups),
  groupMembers: many(groupMembers),
  marketplaceItems: many(marketplaceItems),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  likes: many(likes),
  notifications: many(notifications),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  likes: many(likes),
  notifications: many(notifications),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  comment: one(comments, { fields: [likes.commentId], references: [comments.id] }),
}));

export const friendsRelations = relations(friends, ({ one }) => ({
  user: one(users, { fields: [friends.userId], references: [users.id], relationName: "userFriends" }),
  friend: one(users, { fields: [friends.friendId], references: [users.id], relationName: "friendUser" }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "senderMessages" }),
  recipient: one(users, { fields: [messages.recipientId], references: [users.id], relationName: "recipientMessages" }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  actor: one(users, { fields: [notifications.actorId], references: [users.id] }),
  post: one(posts, { fields: [notifications.relatedPostId], references: [posts.id] }),
  comment: one(comments, { fields: [notifications.relatedCommentId], references: [comments.id] }),
}));

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, { fields: [groups.createdBy], references: [users.id] }),
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, { fields: [groupMembers.groupId], references: [groups.id] }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const marketplaceItemsRelations = relations(marketplaceItems, ({ one }) => ({
  seller: one(users, { fields: [marketplaceItems.sellerId], references: [users.id] }),
}));
