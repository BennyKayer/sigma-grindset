import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import countdownsJson from "@/data/countdowns.json";

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
        );
    }

    // Get the headers
    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
        return new NextResponse("Error occurred -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new NextResponse("Error occurred", {
            status: 400,
        });
    }

    // Create user in my db
    const eventType = evt.type;
    const { id: clerkId } = evt.data as UserJSON;
    if (eventType === "user.created") {
        const newUser = await prisma.user.create({
            data: {
                clerkId,
                email: evt.data.email_addresses[0].email_address,
            },
        });
        const countdowns = countdownsJson.map((el) => {
            return {
                ...el,
                userId: newUser.id,
            };
        });
        await prisma.countdown.createMany({
            data: countdowns,
        });
        return new NextResponse("", { status: 201 });
    }
    // Delete user from my db
    if (eventType === "user.deleted") {
        await prisma.user.delete({
            where: {
                clerkId,
            },
        });
        return new NextResponse(undefined, { status: 204 });
    }
    // Update user in my db
    if (eventType === "user.updated") {
        await prisma.user.update({
            where: {
                clerkId,
            },
            data: {
                email: evt.data.email_addresses[0].email_address,
            },
        });
    }

    return new NextResponse("", { status: 200 });
}
