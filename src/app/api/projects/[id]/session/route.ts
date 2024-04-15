import { NextRequest, NextResponse } from "next/server";
import { prisma, getShortOrLongBreak } from "@/utils/db";
import { toBoolean } from "@/utils/types";
import { addMinute } from "@formkit/tempo";
import { z } from "zod";
import { TimeUnit, getDiff } from "@/features/work";

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId },
    } = params;
    const { searchParams } = new URL(req.url);
    const shouldGetLatest = toBoolean(searchParams.get("latest"));
    const countdownId = searchParams.get("countdownId");

    if (shouldGetLatest) {
        const latest = await prisma.session.findMany({
            where: {
                projectId,
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
            // then award a
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
            return NextResponse.json({ data: latestSession });
        } else {
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
    sessionTime: z.number().optional(),
});
export const POST = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId },
    } = params;
    const { sessionTime } = NewSessionBody.parse(await req.json());

    const start = new Date();
    const newSession = await prisma.session.create({
        data: {
            projectId,
            start,
            stop: sessionTime ? addMinute(start, sessionTime) : start,
            isStopwatch: sessionTime ? false : true,
        },
    });

    return NextResponse.json({ data: newSession });
};
