import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  users,
  posts,
  comments,
  likes,
  friends,
  messages,
  notifications,
  stories,
  groups,
  groupMembers,
  marketplaceItems,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

// User operations
export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(users)
    .values({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
    .returning();

  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUser(id: number, updates: Partial<typeof users.$inferInsert>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .update(users)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return result[0];
}

// Post operations
export async function createPost(postData: {
  userId: number;
  content?: string;
  images?: string[];
  videos?: string[];
  visibility?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(posts)
    .values({
      userId: postData.userId,
      content: postData.content,
      images: postData.images,
      videos: postData.videos,
      visibility: postData.visibility || "public",
    })
    .returning();

  return result[0];
}

export async function getPostsByUserId(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(limit)
    .offset(offset);
}

export async function getFeedPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(posts)
    .where(eq(posts.visibility, "public"))
    .orderBy((t) => t.createdAt)
    .limit(limit)
    .offset(offset);
}

// Comment operations
export async function createComment(commentData: {
  postId: number;
  userId: number;
  content: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(comments)
    .values({
      postId: commentData.postId,
      userId: commentData.userId,
      content: commentData.content,
    })
    .returning();

  return result[0];
}

export async function getCommentsByPostId(postId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy((t) => t.createdAt);
}

// Like operations
export async function addLike(likeData: {
  userId: number;
  postId?: number;
  commentId?: number;
  reactionType?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(likes)
    .values({
      userId: likeData.userId,
      postId: likeData.postId,
      commentId: likeData.commentId,
      reactionType: likeData.reactionType || "like",
    })
    .returning();

  return result[0];
}

// Friend operations
export async function sendFriendRequest(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(friends)
    .values({
      userId,
      friendId,
      status: "pending",
    })
    .returning();

  return result[0];
}

export async function acceptFriendRequest(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .update(friends)
    .set({ status: "accepted", updatedAt: new Date() })
    .where(
      eq(friends.userId, userId) && eq(friends.friendId, friendId)
    )
    .returning();

  return result[0];
}

export async function getFriends(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(friends)
    .where(eq(friends.userId, userId) && eq(friends.status, "accepted"));
}

// Message operations
export async function sendMessage(messageData: {
  senderId: number;
  recipientId: number;
  content: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(messages)
    .values({
      senderId: messageData.senderId,
      recipientId: messageData.recipientId,
      content: messageData.content,
    })
    .returning();

  return result[0];
}

export async function getConversation(userId: number, otherUserId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(messages)
    .where(
      eq(messages.senderId, userId) && eq(messages.recipientId, otherUserId) ||
      eq(messages.senderId, otherUserId) && eq(messages.recipientId, userId)
    )
    .orderBy((t) => t.createdAt);
}

// Notification operations
export async function createNotification(notificationData: {
  userId: number;
  actorId?: number;
  type: string;
  relatedPostId?: number;
  relatedCommentId?: number;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(notifications)
    .values({
      userId: notificationData.userId,
      actorId: notificationData.actorId,
      type: notificationData.type,
      relatedPostId: notificationData.relatedPostId,
      relatedCommentId: notificationData.relatedCommentId,
    })
    .returning();

  return result[0];
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy((t) => t.createdAt);
}

// Story operations
export async function createStory(storyData: {
  userId: number;
  content?: string;
  image?: string;
  video?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const result = await db
    .insert(stories)
    .values({
      userId: storyData.userId,
      content: storyData.content,
      image: storyData.image,
      video: storyData.video,
      expiresAt,
    })
    .returning();

  return result[0];
}

export async function getActiveStories() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(stories)
    .where(eq(stories.expiresAt, new Date()))
    .orderBy((t) => t.createdAt);
}

// Group operations
export async function createGroup(groupData: {
  name: string;
  description?: string;
  image?: string;
  createdBy: number;
  privacy?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(groups)
    .values({
      name: groupData.name,
      description: groupData.description,
      image: groupData.image,
      createdBy: groupData.createdBy,
      privacy: groupData.privacy || "public",
    })
    .returning();

  return result[0];
}

export async function getGroups() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(groups);
}

// Marketplace operations
export async function createMarketplaceItem(itemData: {
  sellerId: number;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  condition?: string;
  location?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(marketplaceItems)
    .values({
      sellerId: itemData.sellerId,
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      images: itemData.images,
      category: itemData.category,
      condition: itemData.condition,
      location: itemData.location,
    })
    .returning();

  return result[0];
}

export async function getMarketplaceItems() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(marketplaceItems)
    .where(eq(marketplaceItems.isAvailable, true));
}

// Cleanup
export async function closeDb() {
  if (_client) {
    await _client.end();
    _client = null;
    _db = null;
  }
}
