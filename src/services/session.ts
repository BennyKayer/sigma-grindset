import { ENVS } from "@/utils/env";
import { Countdown, Session } from "@prisma/client";

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

export const pauseSession = async (id: string, countdownId: string) => {
    const patched = await patchSession(id, SessionPatchTypes.pause, {
        countdownId,
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
