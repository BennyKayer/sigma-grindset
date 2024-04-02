import { ENVS } from "@/utils/env";

const ENDPOINT = `${ENVS.apiUrl}/session`;

export const getLatestSession = async () => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = new URL(ENDPOINT);
    url.searchParams.append("latests", "true");

    const req = new Request(url, init);
    const res = await fetch(req, init);

    if (!res.ok) {
        throw new Error("Failed to get latest session");
    }
    const { data } = await res.json();
    return data;
};

// TODO: Get all for analytics
// TODO: Patch
// TODO: Post
