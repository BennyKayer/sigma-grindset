import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const created = await prisma.session.create({
        data,
    });
    return NextResponse.json({ data: created }, { status: 201 });
};
