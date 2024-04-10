import { expect, test, describe } from "vitest";
import {
    getNormalizedParts,
    TimeUnit,
    getTimeDisplay,
    getDiff,
} from "@/features/work";
import { addMinute } from "@formkit/tempo";

describe("getDiff", () => {
    test("test pomodoro", () => {
        const start = new Date();
        const stop = addMinute(new Date(), 25);
        const diff = getDiff(start, stop);
        // Round to the nearest second to avoid insignificant ms differences
        const roundedDiff = Math.round(diff / 100000) * 100000;
        expect(roundedDiff).eq(25 * 60 * 1000);
    });
});

describe("getTimeDisplay", () => {
    test("milliseconds input", () => {
        const display = getTimeDisplay(1499245, TimeUnit.MS);
        expect(display).eq("24:59");
    });

    test("seconds input", () => {
        const display = getTimeDisplay(61, TimeUnit.SECS);
        expect(display).eq("01:01");
    });

    test("minutes input", () => {
        const display = getTimeDisplay(90, TimeUnit.MIN);
        expect(display).eq("01:30:00");
    });
});

describe("getNormalizedParts", () => {
    test("milliseconds input", () => {
        const { hours, minutes, seconds } = getNormalizedParts(
            2010000,
            TimeUnit.MS,
        );
        expect(hours).equal(0);
        expect(minutes).equal(33);
        expect(seconds).equal(30);
    });

    test("seconds input", () => {
        const { hours, minutes, seconds } = getNormalizedParts(
            374,
            TimeUnit.SECS,
        );
        expect(hours).eq(0);
        expect(minutes).eq(6);
        expect(seconds).eq(14);
    });

    test("minutes input", () => {
        const { hours, minutes, seconds } = getNormalizedParts(
            90,
            TimeUnit.MIN,
        );
        expect(hours).eq(1);
        expect(minutes).eq(30);
        expect(seconds).eq(0);
    });
});
