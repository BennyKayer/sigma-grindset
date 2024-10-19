import { ENVS } from "@/utils/env";

const ENDPOINT = `${ENVS.apiUrl}/notes`;

export const httpGetNoteById = async (id: string) => {
    const init: RequestInit = {
        method: "GET",
    };
    const url = `${ENDPOINT}/${id}`;

    const req = new Request(url, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to get a note");
    }
    const { data } = await res.json();
    return data;
};
