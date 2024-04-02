import { ENVS } from "@/utils/env";
import { Project } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/projects`;

export const getProjects = async () => {
    const init: RequestInit = {
        method: "GET",
        credentials: "include",
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to fetch projects");
    }
    const { data } = await res.json();
    return data as Project[];
};

// TODO: Post

// TODO: Patch

// SEC: Session
export const getLatestSession = async (projectId: string) => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = new URL(`${ENDPOINT}/${projectId}/session`);
    url.searchParams.append("latests", "true");

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to get latest session");
    }
    const { data } = await res.json();
    return data;
};
