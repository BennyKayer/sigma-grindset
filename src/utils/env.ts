const stringToBoolean = (val: unknown): boolean => {
    if (val === undefined) return false;
    if (val === null) return false;
    if (typeof val === "string") {
        if (val === "true" || val === "True") return true;
        return false;
    }
    return false;
};

export const ENVS = {
    enableLog: stringToBoolean(process.env.ENABLE_LOG),
};
