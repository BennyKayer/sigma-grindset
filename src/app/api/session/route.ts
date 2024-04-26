import { NextRequest, NextResponse } from "next/server";
import { getShortOrLongBreak, prisma } from "@/utils/db";
import { toBoolean } from "@/utils/types";
import { TimeUnit, getDiff } from "@/features/work";
import { addSecond } from "@formkit/tempo";

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const created = await prisma.session.create({
        data,
    });
    return NextResponse.json({ data: created }, { status: 201 });
};

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const shouldGetLatest = toBoolean(searchParams.get("latest"));

    if (shouldGetLatest) {
        const latest = await prisma.session.findMany({
            where: {
                OR: [{ isOnGoing: true }, { isPaused: true }],
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 1,
            include: {
                countdown: true,
                project: true,
            },
        });
        if (latest.length) {
            const [latestSession] = latest;
            const diff = getDiff(new Date(), latestSession.stop, TimeUnit.MS);

            // Always return stopwatch
            if (!latestSession.countdownId) {
                return NextResponse.json({ data: latestSession });
            }

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
                const { countdownId, projectId } = latestSession;
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
        }
    }

    return NextResponse.json({ data: null });
};
