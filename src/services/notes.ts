import { ENVS } from "@/utils/env";

const ENDPOINT = `${ENVS.apiUrl}/notes`;

export const getProjectNotes = async (projectId: string) => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = `${ENDPOINT}/${projectId}`;

    const req = new Request(url, init);
    const res = await fetch(req, init);

    if (!res.ok) {
        throw new Error("Failed to fetch notes");
    }
    const { data } = await res.json();
    return data;
};

// TODO: POST
