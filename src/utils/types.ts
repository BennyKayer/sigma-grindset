export const toBoolean = (val: unknown): boolean => {
    if (val === undefined) return false;
    if (val === null) return false;
    if (typeof val === "string") {
        if (val === "true" || val === "True" || val === "1") return true;
        return false;
    }
    if (typeof val === "number") {
        if (val === 1) return true;
        return false;
    }
    return false;
};
