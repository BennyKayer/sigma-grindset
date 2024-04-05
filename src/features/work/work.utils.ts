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
