"use client";

import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useState, useContext } from "react";
import {
    WorkContext,
    getDiff,
    getTimeDisplay,
    TimeUnit,
} from "@/features/work";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { createNewSession, getLatestSession } from "@/services/projects";
import { Session } from "@prisma/client";
import { SessionPatchTypes, patchSession } from "@/services/session";

enum CountdownState {
    STOPPED = "STOPPED",
    STARTED = "STARTED",
    PAUSED = "PAUSED",
}

export default function Countdown() {
    const { currentCountdown, currentProject } = useContext(WorkContext);
    const [countdownState, setCountdownState] = useState<CountdownState>(
        CountdownState.STOPPED,
    );
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [sessionDisplay, setSessionDisplay] = useState("00:00");
    const [currDiff, setCurrDiff] = useState(100);
    const [maxDiff, setMaxDiff] = useState(100);

    // SEC: handlers
    const handleDisplayUpdate = (session: Session | null) => {
        // Stop clicked => reset
        if (!session) {
            setMaxDiff(100);
            setCurrDiff(100);
            const resetDisplay = getTimeDisplay(
                currentCountdown?.sessionTime,
                TimeUnit.MIN,
            );
            setSessionDisplay(resetDisplay);
            return;
        }

        const sessionMax = getDiff(session.start, session.stop, TimeUnit.SECS);
        setMaxDiff(sessionMax);

        const sessionCurrent = getDiff(new Date(), session.stop, TimeUnit.SECS);
        setCurrDiff(sessionCurrent);

        const display = getTimeDisplay(sessionCurrent, TimeUnit.SECS);
        setSessionDisplay(display);
    };

    const handleCountdownStateChange: ToggleButtonGroupProps["onChange"] =
        async (_, value) => {
            const state = value[0] as CountdownState;
            setCountdownState(state);

            switch (state) {
                case CountdownState.STARTED:
                    if (currentSession?.isPaused && currentCountdown) {
                        const unpaused = await patchSession(
                            currentSession?.id,
                            SessionPatchTypes.resume,
                        );
                        handleDisplayUpdate(unpaused);
                        setCurrentSession(unpaused);
                    } else {
                        const newSession = await createNewSession(
                            currentProject?.id,
                            currentCountdown?.sessionTime,
                            false,
                        );
                        handleDisplayUpdate(newSession);
                        setCurrentSession(newSession);
                    }
                    break;
                case CountdownState.PAUSED:
                    if (currentSession && currentCountdown) {
                        const paused = await patchSession(
                            currentSession.id,
                            SessionPatchTypes.pause,
                            { sessionTime: currentCountdown.sessionTime },
                        );
                        handleDisplayUpdate(paused);
                        setCurrentSession(paused);
                    }
                    break;
                case CountdownState.STOPPED:
                    if (currentSession && currentCountdown) {
                        const { isBreak } = currentSession;
                        const { longBrake, longBrakeInterval, shortBrake } =
                            currentCountdown;
                        await patchSession(
                            currentSession.id,
                            isBreak
                                ? SessionPatchTypes.endBreak
                                : SessionPatchTypes.endSession,
                            { shortBrake, longBrake, longBrakeInterval },
                        );
                        setCurrentSession(null);
                        handleDisplayUpdate(null);
                    }
                    break;
                default:
                    break;
            }
        };

    // SEC: useEffect
    useEffect(() => {
        if (currentCountdown) {
            setSessionDisplay(
                getTimeDisplay(currentCountdown.sessionTime, TimeUnit.MIN),
            );
        }
    }, [currentCountdown]);

    // Retrieve session
    useEffect(() => {
        const retrieveLatestSession = async () => {
            const latestSession = await getLatestSession(currentProject?.id);
            setCurrentSession(latestSession);
            if (latestSession?.isOnGoing) {
                setCountdownState(CountdownState.STARTED);
            }
            if (latestSession?.isPaused) {
                setCountdownState(CountdownState.PAUSED);
            }

            const diff = getDiff(new Date(), latestSession?.stop, TimeUnit.MS);
            // Retrieved session is overdue, end it
            if (diff < 0 && latestSession) {
                const { id, isBreak } = latestSession;
                await patchSession(
                    id,
                    isBreak
                        ? SessionPatchTypes.endBreak
                        : SessionPatchTypes.endSession,
                    { ...currentCountdown },
                );
                setCurrentSession(null);
            }
        };
        if (currentProject?.id) {
            retrieveLatestSession();
        }
    }, [currentProject]);

    // Manage session changes
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (currentSession) {
            interval = setInterval(() => {
                handleDisplayUpdate(currentSession);
            }, 400);

            const { isPaused, isOnGoing } = currentSession;
            if (isPaused || !isOnGoing) {
                clearInterval(interval);
            }
        }

        return () => {
            clearInterval(interval);
        };
    }, [currentSession]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Gauge
                value={currDiff}
                valueMax={maxDiff}
                height={300}
                width={300}
                startAngle={0}
                endAngle={360}
                text={sessionDisplay}
            />
            <ToggleButtonGroup onChange={handleCountdownStateChange}>
                <ToggleButton
                    disabled={countdownState !== CountdownState.STARTED}
                    value={CountdownState.PAUSED}
                >
                    <PauseIcon />
                </ToggleButton>
                <ToggleButton
                    disabled={countdownState === CountdownState.STARTED}
                    value={CountdownState.STARTED}
                >
                    <PlayArrowIcon />
                </ToggleButton>
                <ToggleButton
                    disabled={countdownState === CountdownState.STOPPED}
                    value={CountdownState.STOPPED}
                >
                    <StopIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
