import { getUserUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { id } = await getUserUserByClerkId();
    const { name } = await req.json();

    const project = await prisma.project.create({
        data: {
            userId: id,
            name,
        },
    });

    return NextResponse.json({ data: project }, { status: 201 });
};

export const GET = async () => {
    const { id } = await getUserUserByClerkId();

    const projects = await prisma.project.findMany({
        where: {
            userId: id,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return NextResponse.json({ data: projects }, { status: 200 });
};
