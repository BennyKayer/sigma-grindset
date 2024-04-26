import { NextRequest, NextResponse } from "next/server";
import { prisma, getShortOrLongBreak } from "@/utils/db";
import { addMinute } from "@formkit/tempo";
import { z } from "zod";

type Params = {
    params: {
        id: string;
        countdownId: string | undefined;
    };
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
