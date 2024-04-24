import { ENVS } from "@/utils/env";
import { Countdown } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/countdown`;

export const getUserCountdowns = async () => {
    const init: RequestInit = {
        method: "GET",
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to fetch countdowns");
    }
    const { data } = await res.json();
    return data;
};

export const postUserCountdown = async (body: Partial<Countdown>) => {
    const init: RequestInit = {
        method: "POST",
        body: JSON.stringify(body),
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to create a countdown");
    }
    const { data } = await res.json();
    return data;
};
