import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, params: Params) => {
    const data = await req.json();
    const {
        params: { id },
    } = params;

    const updated = await prisma.project.update({
        where: {
            id,
        },
        data,
    });

    return NextResponse.json({ data: updated });
};
