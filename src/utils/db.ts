import { PrismaClient } from "@prisma/client";
import { ENVS } from "@/utils/env";

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

export const getShortOrLongBreak = async (
    countdownId: string | null | undefined,
    projectId: string | undefined,
) => {
    // Break for stopwatch does not exist
    if (!countdownId) return 0;
    const { longBreak, longBreakInterval, shortBreak } =
        await prisma.countdown.findUniqueOrThrow({
            where: { id: countdownId },
        });

    // Some countdowns don't have longBreak skip session counting
    if (!longBreak || !longBreakInterval) {
        return shortBreak;
    }

    // Get number of session complete today and decide
    // whether the break should be short or long
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionsToday = await prisma.session.count({
        where: {
            projectId,
            updatedAt: {
                gte: today,
            },
            isBreak: false,
        },
    });

    // Decide on short or long brake
    if (sessionsToday % longBreakInterval === 0) {
        return longBreak;
    } else {
        return shortBreak;
    }
};
