import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import * as crypto from "crypto";

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
          });
        }

        // Create new user
        const newUser = await db.createUser({
          email: input.email,
          password: hashPassword(input.password),
          firstName: input.firstName,
          lastName: input.lastName,
        });

        return {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          message: "User registered successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
        });
      }
    }),

  // Login user
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await db.getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        if (!verifyPassword(input.password, user.password)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Generate simple JWT token (in production, use proper JWT library)
        const token = Buffer.from(
          JSON.stringify({
            id: user.id,
            email: user.email,
            iat: Date.now(),
          })
        ).toString("base64");

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          token,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  // Get current user
  getCurrentUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      try {
        const user = await db.getUserById(input.userId);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          bio: user.bio,
          coverPhoto: user.coverPhoto,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  // Update user profile
  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        coverPhoto: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { userId, ...updates } = input;
        const updatedUser = await db.updateUser(userId, updates);

        return {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          message: "Profile updated successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),

  // Change password
  changePassword: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        oldPassword: z.string(),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await db.getUserById(input.userId);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (!verifyPassword(input.oldPassword, user.password)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid old password",
          });
        }

        await db.updateUser(input.userId, {
          password: hashPassword(input.newPassword),
        });

        return { message: "Password changed successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change password",
        });
      }
    }),
});
