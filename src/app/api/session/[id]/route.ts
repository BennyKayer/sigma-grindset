import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { Countdown, Session } from "@prisma/client";
import { TimeUnit, getDiff } from "@/features/work";
import { addSecond } from "@formkit/tempo";

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, params: Params) => {
    const {
        params: { id },
    } = params;
    const data = (await req.json()) as Partial<Session> & Partial<Countdown>; // TODO: Better types
    const { isOnGoing, isPaused } = data;

    // Handle stop request
    if (isOnGoing === false) {
        const stopped = await prisma.session.update({
            where: { id },
            data: {
                isOnGoing: false,
            },
        });
        return NextResponse.json({ data: stopped });
    }

    // Handle pause request
    if (isPaused === true) {
        const unpausedSession = await prisma.session.findUniqueOrThrow({
            where: { id },
        });
        // Calculate accumulation
        const start = new Date();
        const pauseDiff = getDiff(unpausedSession.start, start, TimeUnit.MIN);
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
                isPaused,
                accumulatedMinutes,
                start,
                stop,
            },
        });

        return NextResponse.json({ data: pausedSession });
    }
    // Handle unpause request
    if (isPaused === false) {
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
                isPaused,
                start,
                stop,
            },
        });

        return NextResponse.json({ data: unpausedSession });
    }

    const updated = await prisma.session.update({
        where: {
            id,
        },
        data,
    });

    return NextResponse.json({ data: updated });
};
