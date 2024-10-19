import { ENVS } from "@/utils/env";
import { ElasticHabit } from "@prisma/client";

const ENDPOINT = `${ENVS.apiUrl}/elasticHabits`;

export const httpGetUserElasticHabits = async (): Promise<ElasticHabit[]> => {
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
