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
import { endSession, pauseSession, resumeSession } from "@/services/session";

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
    const [isBreak, setIsBreak] = useState(false);

    // SEC: handlers
    const handleResetCountdown = (session: null | number) => {
        setCountdownState(CountdownState.STOPPED);
        setCurrentSession(null);
        const display = getTimeDisplay(session, TimeUnit.MIN);
        setSessionDisplay(display);
        setCurrDiff(100);
        setMaxDiff(100);
    };

    const handleSessionUpdate = (session: Session | null) => {
        // Stop clicked => reset
        if (!session) {
            setCurrentSession(null);
            setCountdownState(CountdownState.STOPPED);
            const resetDisplay = getTimeDisplay(
                currentCountdown?.sessionTime,
                TimeUnit.MIN,
            );
            setSessionDisplay(resetDisplay);
            setCurrDiff(100);
            setMaxDiff(100);
            return 0;
        }
        setCurrentSession(session);
        const { isPaused, isOnGoing } = session;
        if (isPaused) {
            setCountdownState(CountdownState.PAUSED);
        } else if (isOnGoing) {
            setCountdownState(CountdownState.STARTED);
        }

        const sessionMax = getDiff(session.start, session.stop, TimeUnit.SECS);
        setMaxDiff(sessionMax);

        const sessionCurrent = getDiff(new Date(), session.stop, TimeUnit.SECS);
        setCurrDiff(sessionCurrent);

        const display = getTimeDisplay(sessionCurrent, TimeUnit.SECS);
        setSessionDisplay(display);

        return sessionCurrent;
    };

    const handleCountdownStateChange: ToggleButtonGroupProps["onChange"] =
        async (_, value) => {
            const state = value[0] as CountdownState;
            setCountdownState(state);

            switch (state) {
                case CountdownState.STARTED:
                    if (currentSession?.isPaused && currentCountdown) {
                        const unpaused = await resumeSession(currentSession.id);
                        handleSessionUpdate(unpaused);
                    } else {
                        const newSession = await createNewSession(
                            currentProject?.id,
                            currentCountdown?.id,
                            isBreak,
                        );
                        handleSessionUpdate(newSession);
                    }
                    break;
                case CountdownState.PAUSED:
                    if (currentSession && currentCountdown) {
                        const paused = await pauseSession(
                            currentSession.id,
                            currentCountdown.id,
                        );
                        handleSessionUpdate(paused);
                    }
                    break;
                case CountdownState.STOPPED:
                    if (currentSession && currentCountdown && currentProject) {
                        const endedSession = await endSession(
                            currentSession.id,
                            currentCountdown.id,
                            currentProject.id,
                        );
                        handleResetCountdown(endedSession);
                    }
                    break;
                default:
                    break;
            }
        };

    // SEC: useEffect
    // Handle countdown change
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
            if (currentProject && currentCountdown) {
                const latestSession = await getLatestSession(
                    currentProject.id,
                    currentCountdown.id,
                );
                // No session retrieved -> do nothing
                if (!latestSession) return;

                // Break time retrieved -> set timer to break
                if (typeof latestSession === "number") {
                    handleResetCountdown(latestSession);
                    setIsBreak(true);
                    return;
                } else {
                    handleSessionUpdate(latestSession);
                    setIsBreak(false);
                }
            }
        };
        retrieveLatestSession();
    }, [currentProject, currentCountdown]);

    // Manage session changes
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (currentSession) {
            interval = setInterval(() => {
                const secsLeft = handleSessionUpdate(currentSession);
                if (secsLeft <= 0) {
                    const { isBreak } = currentSession;
                    // TODO: End session
                    clearInterval(interval);
                }
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
