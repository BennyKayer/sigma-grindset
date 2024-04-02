import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { format } from "@formkit/tempo";

type Params = {
    params: {
        projectId: string;
    };
};

// TODO: This should probably be nest under projects/id
// however I don't anticipate adding /id for notes for now
// that's why it stays here

export const GET = async (_: NextRequest, params: Params) => {
    const {
        params: { projectId },
    } = params;
    const notes = await prisma.note.findMany({
        where: {
            projectId,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return NextResponse.json({ data: notes });
};

export const POST = async (req: NextRequest, params: Params) => {
    const { header, content } = await req.json();
    const {
        params: { projectId },
    } = params;

    const newNote = await prisma.note.create({
        data: {
            content,
            header: header ? header : format(new Date(), "DD.MM.YYYY"),
            projectId,
        },
    });

    return NextResponse.json({ data: newNote }, { status: 201 });
};