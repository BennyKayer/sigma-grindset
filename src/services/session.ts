import { ENVS } from "@/utils/env";
import { Countdown, Project, Session } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/session`;

export const getLatestSession = async () => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = new URL(ENDPOINT);
    url.searchParams.append("latest", "true");

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to get latest session");
    }
    const { data } = await res.json();
    return data as
        | (Session & { countdown: Countdown; project: Project })
        | null
        | number;
};

// SEC: /[id]
export enum SessionPatchTypes {
    start = "START",
    pause = "PAUSE",
    resume = "RESUME",
    endSession = "END_SESSION",
}

export const patchSession = async (id: string, type: SessionPatchTypes) => {
    const init: RequestInit = {
        method: "PATCH",
        body: JSON.stringify({
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

// TODO: There's some issue with paused sessions
// they add some additional time to what's accumulated
// fix later
export const resumeSession = async (id: string) => {
    const patched = await patchSession(id, SessionPatchTypes.resume);
    return patched as Session;
};

export const pauseSession = async (id: string) => {
    const patched = await patchSession(id, SessionPatchTypes.pause);
    return patched as Session;
};

export const endSession = async (id: string) => {
    const patched = await patchSession(id, SessionPatchTypes.endSession);
    return patched as null | number;
};
