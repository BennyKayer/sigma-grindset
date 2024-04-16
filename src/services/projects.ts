import { ENVS } from "@/utils/env";
import { Project } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/projects`;

export const getProjects = async () => {
    const init: RequestInit = {
        method: "GET",
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to fetch projects");
    }
    const { data } = await res.json();
    return data as Project[];
};

export const postNewProject = async (name: string) => {
    const init: RequestInit = {
        method: "POST",
        body: JSON.stringify({
            name,
        }),
    };

    const req = new Request(ENDPOINT, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to create new project");
    }
    const { data } = await res.json();
    return data as Project;
};

export const patchProject = async (name: string, id: string) => {
    const init: RequestInit = {
        method: "PATCH",
        body: JSON.stringify({
            name,
        }),
    };
    const url = `${ENDPOINT}/${id}`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to patch a project");
    }
    const { data } = await res.json();
    return data as Project;
};
