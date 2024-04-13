import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { toBoolean } from "@/utils/types";
import { addMinute } from "@formkit/tempo";
import { z } from "zod";

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
        return NextResponse.json({ data: latest });
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
    isBreak: z.boolean(),
});
export const POST = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId },
    } = params;
    const { sessionTime, isBreak } = NewSessionBody.parse(await req.json());

    const start = new Date();
    const newSession = await prisma.session.create({
        data: {
            projectId,
            start,
            stop: sessionTime ? addMinute(start, sessionTime) : start,
            isStopwatch: sessionTime ? false : true,
            isBreak,
        },
    });

    return NextResponse.json({ data: newSession });
};
