import { NextRequest, NextResponse } from "next/server";
import { createBreak, prisma } from "@/utils/db";
import { TimeUnit, getDiff } from "@/features/work";
import { addSecond } from "@formkit/tempo";
import { z } from "zod";
import { SessionPatchTypes } from "@/services/session";

type Params = {
    params: {
        id: string;
    };
};

const EndSessionSchema = z.object({
    shortBreak: z.number(),
    longBreak: z.number().nullable(),
    longBreakInterval: z.number().nullable(),
});

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
            const { longBreak, longBreakInterval, shortBreak } =
                EndSessionSchema.parse(data);

            // First stop the session and retrieve its project's id
            const stopped = await prisma.session.update({
                where: { id },
                data: {
                    isOnGoing: false,
                },
            });
            const { projectId } = stopped;

            // TODO: Better end
        }
        case SessionPatchTypes.pause: {
            const unpausedSession = await prisma.session.findUniqueOrThrow({
                where: { id },
            });
            // Calculate accumulation
            const start = new Date();
            const pauseDiff = getDiff(
                unpausedSession.start,
                start,
                TimeUnit.MIN,
            );
            const accumulatedMinutes =
                unpausedSession.accumulatedMinutes + pauseDiff;

            // Calculate remaining session time
            const sessionProgressSec = getDiff(
                unpausedSession.start,
                start,
                TimeUnit.SECS,
            );
            const { sessionTime } = data;
            if (!sessionTime) {
                throw Error(`Session time is ${sessionTime}`);
            }
            const sessionTimeSec = sessionTime * 60;
            const leftInSession = sessionTimeSec - sessionProgressSec;
            const stop = addSecond(start, leftInSession);

            const pausedSession = await prisma.session.update({
                where: { id },
                data: {
                    isPaused: true,
                    accumulatedMinutes,
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
        case SessionPatchTypes.endBreak: {
            // TODO:
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
