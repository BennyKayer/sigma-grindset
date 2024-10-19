import { ENVS } from "@/utils/env";
import { Project, Session } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/projects`;

// SEC: Projects
//#region
export const httpGetProjects = async () => {
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

export const httpPostNewProject = async (name: string) => {
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

// /[id]
export const httpPatchProject = async (name: string, id: string) => {
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
//#endregion

// SEC: Notes
//#region
export const httpGetProjectNotes = async (projectId: string) => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = `${ENDPOINT}/${projectId}/notes`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to fetch notes");
    }
    const { data } = await res.json();
    return data;
};

type PostProjectBody = {
    header?: string;
    content: string;
};
export const httpPostProjectNote = async (
    projectId: string,
    body: PostProjectBody,
) => {
    const init: RequestInit = {
        method: "POST",
        body: JSON.stringify(body),
    };
    const url = `${ENDPOINT}/${projectId}/notes`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to create a note");
    }
    const { data } = await res.json();
    return data;
};
//#endregion

// SEC: Sessions
export const httpCreateNewSession = async (
    projectId: string | undefined,
    countdownId: string | undefined,
    isBreak: boolean,
) => {
    const init: RequestInit = {
        method: "POST",
        body: JSON.stringify({
            isBreak,
        }),
    };
    const url = new URL(`${ENDPOINT}/${projectId}/session/${countdownId}`);

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        console.error(res);
        throw new Error("Failed to create a session");
    }
    const { data } = await res.json();
    return data as Session;
};
