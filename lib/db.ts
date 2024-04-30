import { PrismaClient } from '@prisma/client';

// Create a singleton function for Prisma Client
const prismaClientSingleton = () => {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient();
  }
  return globalThis.prismaGlobal;
};

// Declare global variable prismaGlobal
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// Export the Prisma Client instance
export const db = prismaClientSingleton();
