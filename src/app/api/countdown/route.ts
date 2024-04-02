import { NextRequest, NextResponse } from "next/server";
import { getUserUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

export const GET = async () => {
    const { id: userId } = await getUserUserByClerkId();
    const countdowns = await prisma.countdown.findMany({
        where: {
            userId,
        },
    });

    return NextResponse.json({ data: countdowns });
};

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const { id: userId } = await getUserUserByClerkId();
    const countdown = await prisma.countdown.create({
        data: {
            userId,
            ...data,
        },
    });
    return NextResponse.json({ data: countdown }, { status: 201 });
};
