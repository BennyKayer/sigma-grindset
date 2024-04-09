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

export const getDiff = (stopTime: Date) => {
    const now = new Date();
    const stop = new Date(stopTime);
    const diff = stop.getTime() - now.getTime();

    if (diff > 0) {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const seconds = Math.floor(diff / 1000) % 60;

        const secondsString = seconds.toString().padStart(2, "0");
        const minutesString = minutes.toString().padStart(2, "0");
        const hoursString = hours.toString().padStart(2, "0");

        if (hours) {
            return `${hoursString}:${minutesString}:${secondsString}`;
        } else {
            return `${minutesString}:${secondsString}`;
        }
    } else {
        return "00:00";
    }
};
