import { expect, test, describe } from "vitest";
import { getNormalizedParts, TimeUnit, getTimeDisplay } from "@/features/work";

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
