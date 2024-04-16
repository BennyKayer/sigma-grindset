import { ENVS } from "@/utils/env";
import { Session } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/session`;

export enum SessionPatchTypes {
    start = "START",
    pause = "PAUSE",
    resume = "RESUME",
    endSession = "END_SESSION",
}

type PatchSessionBody = {
    countdownId?: string;
    projectId?: string;
};
export const patchSession = async (
    id: string,
    type: SessionPatchTypes,
    body?: PatchSessionBody,
) => {
    const init: RequestInit = {
        method: "PATCH",
        body: JSON.stringify({
            ...body,
            type,
        }),
    };
    const url = `${ENDPOINT}/${id}`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to end the session");
    }
    const { data } = await res.json();
    return data as Session | number | null;
};

export const resumeSession = async (id: string) => {
    const patched = await patchSession(id, SessionPatchTypes.resume);
    return patched as Session;
};

export const pauseSession = async (
    id: string,
    countdownId: string,
    projectId: string,
) => {
    const patched = await patchSession(id, SessionPatchTypes.pause, {
        countdownId,
        projectId,
    });
    return patched as Session;
};

export const endSession = async (
    id: string,
    countdownId: string,
    projectId: string,
) => {
    const patched = await patchSession(id, SessionPatchTypes.endSession, {
        countdownId,
        projectId,
    });
    return patched as null | number;
};

// SEC: /project
const PROJECT_ENDPOINT = `${ENDPOINT}/project`;
export const getLatestSession = async (
    projectId: string | undefined,
    countdownId: string | undefined,
) => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = new URL(`${PROJECT_ENDPOINT}/${projectId}/${countdownId}`);
    url.searchParams.append("latest", "true");

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to get latest session");
    }
    const { data } = await res.json();
    return data as Session | null | number;
};

export const createNewSession = async (
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
    const url = new URL(`${PROJECT_ENDPOINT}/${projectId}/${countdownId}`);

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        console.error(res);
        throw new Error("Failed to create a session");
    }
    const { data } = await res.json();
    return data as Session;
};
