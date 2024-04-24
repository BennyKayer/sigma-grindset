import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (_: NextRequest, params: Params) => {
    const {
        params: { id },
    } = params;

    const note = await prisma.note.findUniqueOrThrow({
        where: {
            id,
        },
    });

    return NextResponse.json({ data: note });
};
