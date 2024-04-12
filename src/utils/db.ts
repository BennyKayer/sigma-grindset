import { PrismaClient } from "@prisma/client";
import { ENVS } from "@/utils/env";
import { addMinute } from "@formkit/tempo";

// There is this globalThis thing in node
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// If it's not already attach, attach it
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ENVS.enableLog ? ["query"] : [],
    });

// Prevent Next.js from dying after 10 hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const createBreak = async (breakTime: number, projectId: string) => {
    const start = new Date();
    return await prisma.session.create({
        data: {
            start,
            stop: addMinute(start, breakTime),
            projectId,
            isBreak: true,
            isOnGoing: false,
        },
    });
};
