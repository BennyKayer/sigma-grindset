import { ENVS } from "@/utils/env";

const ENDPOINT = `${ENVS.apiUrl}/elasticHabits`;

export const getUserElasticHabits = async () => {
    const init: RequestInit = {
        method: "GET",
    };
    const queryParams = new URLSearchParams();
    queryParams.set("isTemplate", "false");

    const req = new Request(`${ENDPOINT}?${queryParams.toString()}`, init);
    const res = await fetch(req);

    if (!res.ok) {
        throw new Error("Failed to fetch countdowns");
    }
    const { data } = await res.json();
    return data;
};
