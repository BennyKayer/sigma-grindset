import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { toBoolean } from "@/utils/types";

type Params = {
    params: {
        projectId: string;
    };
};

export const GET = async (req: NextRequest, params: Params) => {
    const {
        params: { projectId },
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
