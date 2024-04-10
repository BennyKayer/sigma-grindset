// TODO: DRY, tests, single responsibility
export const minToTime = (minutes: number | undefined): string => {
    if (!minutes) return "00:00";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const minutesString = remainingMinutes.toString().padStart(2, "0");
    if (hours) {
        const hoursString = hours.toString().padStart(2, "0");
        return `${hoursString}:${minutesString}:00`;
    } else {
        return `${minutesString}:00`;
    }
};

export const getDiff = (stopTime: Date | string | undefined | null): number => {
    if (!stopTime) return -1;

    const now = new Date();
    const stop = new Date(stopTime);
    const diff = stop.getTime() - now.getTime();

    return diff;
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
