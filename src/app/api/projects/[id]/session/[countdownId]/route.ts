import { NextRequest, NextResponse } from "next/server";
import { prisma, getShortOrLongBreak } from "@/utils/db";
import { toBoolean } from "@/utils/types";
import { addMinute, addSecond } from "@formkit/tempo";
import { z } from "zod";
import { TimeUnit, getDiff } from "@/features/work";

type Params = {
    params: {
        id: string;
        countdownId: string | undefined;
    };
};

export const GET = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId, countdownId },
    } = params;
    const { searchParams } = new URL(req.url);
    const shouldGetLatest = toBoolean(searchParams.get("latest"));

    if (shouldGetLatest) {
        const latest = await prisma.session.findMany({
            where: {
                projectId,
                countdownId,
                AND: {
                    OR: [{ isOnGoing: true }, { isPaused: true }],
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 1,
        });
        if (latest.length) {
            const [latestSession] = latest;
            const diff = getDiff(new Date(), latestSession.stop, TimeUnit.MS);

            // Retrieved session is overdue, end it
            // then award a break
            if (diff <= 0) {
                await prisma.session.update({
                    where: {
                        id: latestSession.id,
                    },
                    data: {
                        isOnGoing: false,
                    },
                });
                const breakTime = await getShortOrLongBreak(
                    countdownId,
                    projectId,
                );
                return NextResponse.json({ data: breakTime });
            }
            // The dates won't be updated on session
            // need to adjust this for initial display
            const adjustedSec = getDiff(
                latestSession.start,
                latestSession.stop,
                TimeUnit.SECS,
            );
            const start = new Date();
            const stop = addSecond(start, adjustedSec);
            return NextResponse.json({
                data: { ...latestSession, start, stop },
            });
        } else {
            if (!projectId) {
                // Maybe there's a stopwatch session?
                const latestStopwatch = await prisma.session.findMany({
                    where: {
                        projectId,
                        AND: {
                            OR: [{ isOnGoing: true }, { isPaused: true }],
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                    take: 1,
                });
                if (latestStopwatch.length) {
                    return NextResponse.json({ data: latestStopwatch[0] });
                }
            }

            return NextResponse.json({ data: null });
        }
    }

    const projectSessions = await prisma.session.findMany({
        where: {
            projectId,
        },
    });
    return NextResponse.json({ data: projectSessions });
};

const NewSessionBody = z.object({
    isBreak: z.boolean(),
});
export const POST = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId, countdownId },
    } = params;
    const { isBreak } = NewSessionBody.parse(await req.json());

    const countdown = await prisma.countdown.findUnique({
        where: {
            id: countdownId,
        },
    });
    const start = new Date();

    // Handle stopwatch session
    if (!countdown) {
        const newStopwatchSession = await prisma.session.create({
            data: {
                projectId,
                start,
                stop: start,
                isOnGoing: true,
                isStopwatch: true,
            },
        });
        return NextResponse.json({ data: newStopwatchSession });
    }

    const timeToAdd = isBreak
        ? await getShortOrLongBreak(countdownId, projectId)
        : countdown.sessionTime;
    const stop = addMinute(start, timeToAdd);
    const newSession = await prisma.session.create({
        data: {
            projectId,
            start,
            stop,
            isBreak,
            isOnGoing: true,
            countdownId,
        },
    });

    return NextResponse.json({ data: newSession });
};
