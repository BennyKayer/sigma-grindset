import { ENVS } from "@/utils/env";
import { Countdown, Session } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/session`;

export enum SessionPatchTypes {
    start = "START",
    pause = "PAUSE",
    resume = "RESUME",
    endSession = "END_SESSION",
    endBreak = "END_BREAK",
}

export const patchSession = async (
    id: string,
    type: SessionPatchTypes,
    body?: Partial<Countdown>,
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
    return data as Session;
};
