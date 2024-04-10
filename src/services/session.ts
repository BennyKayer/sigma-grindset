import { ENVS } from "@/utils/env";
import { Session } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/session`;

export const patchEndSession = async (id: string) => {
    const init: RequestInit = {
        method: "PATCH",
        body: JSON.stringify({
            isOnGoing: false,
        }),
    };
    const url = `${ENDPOINT}/${id}`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to end session");
    }
    const { data } = await res.json();
    return data as Session;
};

// TODO: Get all for analytics
// TODO: Patch
// TODO: Post
