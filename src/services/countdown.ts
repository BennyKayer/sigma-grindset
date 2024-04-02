import { ENVS } from "@/utils/env";

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

// TODO: POST
