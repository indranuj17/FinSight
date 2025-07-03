// Import the PrismaClient class from the Prisma package.

// This is the auto-generated client used to interact with your database.
import { PrismaClient } from "@/lib/generated/prisma";

// Create a single shared instance of PrismaClient.
// If `globalThis.prisma` already exists (in development), reuse it.
// Otherwise, create a new instance.
export const db = globalThis.prisma || new PrismaClient();

/*
  In development, Next.js hot-reloads frequently.
  This can cause new PrismaClient instances to be created on every reload,
  which may lead to "too many connections" or memory leaks.

  To prevent this, we store the PrismaClient instance on the global object (`globalThis`),
  so it's reused across hot-reloads instead of creating a new one each time.
*/
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
