import { NextRequest, NextResponse } from "next/server";
import { getUserUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { toBoolean } from "@/utils/types";

export const GET = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;
    const isTemplate = toBoolean(searchParams.get("isTemplate"));

    const { id: userId } = await getUserUserByClerkId();
    const elasticHabits = await prisma.elasticHabit.findMany({
        where: {
            userId,
            isTemplate,
        },
    });

    return NextResponse.json({ data: elasticHabits });
};
