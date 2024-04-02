import { toBoolean } from "@/utils/types";

export const ENVS = {
    enableLog: toBoolean(process.env.ENABLE_LOG),
    apiUrl: process.env.URL
        ? `${process.env.URL}/api`
        : "http://localhost:3000/api",
};
