import { ENVS } from "@/utils/env";

const ENDPOINT = `${ENVS.apiUrl}/projects`;

export const getProjects = async () => {
    const init: RequestInit = {
        method: "GET",
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req, init);

    if (!res.ok) {
        throw new Error("Failed to fetch projects");
    }
    const { data } = await res.json();
    return data;
};

// TODO: Post

// TODO: Patch
