import { NextRequest, NextResponse } from "next/server";
import { getShortOrLongBreak, prisma } from "@/utils/db";
import { TimeUnit, getDiff } from "@/features/work";
import { addSecond } from "@formkit/tempo";
import { z } from "zod";
import { SessionPatchTypes } from "@/services/session";

type Params = {
    params: {
        id: string;
    };
};

const SharedPatchSchema = z.object({
    type: z
        .nativeEnum(SessionPatchTypes)
        .describe("Type of the patch is required"),
});

export const PATCH = async (req: NextRequest, params: Params) => {
    const {
        params: { id },
    } = params;
    const data = await req.json();
    const { type } = SharedPatchSchema.parse(data);

    switch (type) {
        case SessionPatchTypes.endSession: {
            // First stop the session and retrieve its project's id
            const stopped = await prisma.session.update({
                where: { id },
                data: {
                    isOnGoing: false,
                    isPaused: false,
                },
                include: {
                    countdown: {
                        select: {
                            id: true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            if (stopped.isBreak) {
                return NextResponse.json({ data: null });
            } else {
                const breakTime = await getShortOrLongBreak(
                    stopped.countdownId,
                    stopped.projectId,
                );
                return NextResponse.json({ data: breakTime });
            }
        }
        case SessionPatchTypes.pause: {
            const unpausedSession = await prisma.session.findUniqueOrThrow({
                where: { id },
                include: {
                    countdown: {
                        select: {
                            id: true,
                            sessionTime: true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            const { countdownId, projectId, countdown } = unpausedSession;

            if (!countdown) {
                // TODO: Handle stopwatch
                return;
            }

            // Calculate accumulation
            const start = new Date();
            const pauseDiff = getDiff(
                unpausedSession.start,
                start,
                TimeUnit.SECS,
            );
            const accumulatedSeconds =
                unpausedSession.accumulatedSeconds + pauseDiff;

            // Calculate remaining session time
            const sessionProgressSec = getDiff(
                unpausedSession.start,
                start,
                TimeUnit.SECS,
            );
            const sessionTime = unpausedSession.isBreak
                ? await getShortOrLongBreak(countdownId, projectId)
                : countdown.sessionTime;
            const leftInSession = sessionTime * 60 - sessionProgressSec;
            const stop = addSecond(start, leftInSession);

            const pausedSession = await prisma.session.update({
                where: { id },
                data: {
                    isPaused: true,
                    accumulatedSeconds,
                    start,
                    stop,
                },
            });

            return NextResponse.json({ data: pausedSession });
        }
        case SessionPatchTypes.resume: {
            const pausedSession = await prisma.session.findFirstOrThrow({
                where: { id },
            });
            const start = new Date();
            const diff = getDiff(
                pausedSession.start,
                pausedSession.stop,
                TimeUnit.SECS,
            );

            const stop = addSecond(start, diff);

            const unpausedSession = await prisma.session.update({
                where: { id },
                data: {
                    isPaused: false,
                    start,
                    stop,
                },
            });

            return NextResponse.json({ data: unpausedSession });
        }
        default: {
            const updated = await prisma.session.update({
                where: {
                    id,
                },
                data,
            });

            return NextResponse.json({ data: updated });
        }
    }
};
