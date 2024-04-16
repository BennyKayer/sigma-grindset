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
import { Session } from "@prisma/client";
import {
    createNewSession,
    endSession,
    getLatestSession,
    pauseSession,
    resumeSession,
} from "@/services/session";

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
        const display = getTimeDisplay(
            session ? session : currentCountdown?.sessionTime,
            TimeUnit.MIN,
        );
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

        const sessionMax =
            getDiff(session.start, session.stop, TimeUnit.SECS) +
            session.accumulatedSeconds;
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
                    if (currentSession?.isPaused) {
                        const unpaused = await resumeSession(currentSession.id);
                        handleSessionUpdate(unpaused);
                    } else {
                        const newSession = await createNewSession(
                            currentProject?.id,
                            currentCountdown?.id,
                            isBreak,
                        );
                        setIsBreak(newSession.isBreak);
                        handleSessionUpdate(newSession);
                    }
                    break;
                case CountdownState.PAUSED:
                    if (currentSession && currentCountdown && currentProject) {
                        const paused = await pauseSession(
                            currentSession.id,
                            currentCountdown.id,
                            currentProject.id,
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
                        if (typeof endedSession === "number") {
                            setIsBreak(true);
                        } else {
                            setIsBreak(false);
                        }
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

        if (currentSession && currentCountdown && currentProject) {
            interval = setInterval(async () => {
                const secsLeft = handleSessionUpdate(currentSession);
                if (secsLeft <= 0) {
                    const endedSession = await endSession(
                        currentSession.id,
                        currentCountdown.id,
                        currentProject.id,
                    );
                    handleResetCountdown(endedSession);
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
    }, [currentSession, currentCountdown, currentProject]);

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
