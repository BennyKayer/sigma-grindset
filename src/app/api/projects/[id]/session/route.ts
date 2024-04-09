import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { toBoolean } from "@/utils/types";
import { addMinute } from "@formkit/tempo";
import { NewSessionBody } from "@/services/projects";

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
        const latest = await prisma.session.findFirst({
            where: {
                projectId,
                isOnGoing: true,
            },
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

export const POST = async (req: NextRequest, params: Params) => {
    const {
        params: { id: projectId },
    } = params;
    const { sessionTime } = (await req.json()) as NewSessionBody;

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
