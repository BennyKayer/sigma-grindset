export const getDiff = (
    startTime: Date | string | undefined | null,
    stopTime: Date | string | undefined | null,
    as: TimeUnit,
): number => {
    if (!stopTime) stopTime = new Date();
    if (!startTime) startTime = new Date();

    const stop = new Date(stopTime);
    const start = new Date(startTime);
    const diff = stop.getTime() - start.getTime();

    switch (as) {
        case TimeUnit.MIN:
            return Math.floor(diff / 1000 / 60);
        case TimeUnit.SECS:
            return Math.floor(diff / 1000);
        case TimeUnit.MS:
        default:
            return diff;
    }
};

export enum TimeUnit {
    MS,
    SECS,
    MIN,
}
export const getNormalizedParts = (
    time: number | undefined | null,
    unit: TimeUnit,
) => {
    let hours = 0,
        minutes = 0,
        seconds = 0;

    if (!time) {
        return { hours, minutes, seconds };
    }

    switch (unit) {
        case TimeUnit.MS:
            hours = Math.floor(time / 1000 / 60 / 60);
            minutes = Math.floor(time / 1000 / 60) % 60;
            seconds = Math.floor(time / 1000) % 60;
            break;
        case TimeUnit.SECS:
            hours = Math.floor(time / 60 / 60);
            minutes = Math.floor(time / 60) % 60;
            seconds = time % 60;
            break;
        case TimeUnit.MIN:
            hours = Math.floor(time / 60);
            minutes = time % 60;
            break;
        default:
            break;
    }
    return { hours, minutes, seconds };
};

export const getTimeDisplay = (
    time: number | undefined | null,
    unit: TimeUnit,
) => {
    const { hours, minutes, seconds } = getNormalizedParts(time, unit);
    const secondsString = seconds.toString().padStart(2, "0");
    const minutesString = minutes.toString().padStart(2, "0");
    const hoursString = hours.toString().padStart(2, "0");

    if (hours) {
        return `${hoursString}:${minutesString}:${secondsString}`;
    }
    return `${minutesString}:${secondsString}`;
};
