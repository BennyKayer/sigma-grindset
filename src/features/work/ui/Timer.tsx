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

enum TimerState {
    STOPPED = "STOPPED",
    STARTED = "STARTED",
    PAUSED = "PAUSED",
}

export default function Timer() {
    const { currentCountdown, currentProject } = useContext(WorkContext);
    const [timerState, setTimerState] = useState<TimerState>(
        TimerState.STOPPED,
    );
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [sessionDisplay, setSessionDisplay] = useState("00:00");
    const [currDiff, setCurrDiff] = useState(100);
    const [maxDiff, setMaxDiff] = useState(100);
    const [isBreak, setIsBreak] = useState(false);

    // SEC: handlers
    const handleResetTimer = (session: null | number) => {
        setTimerState(TimerState.STOPPED);
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
            setTimerState(TimerState.STOPPED);
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
            setTimerState(TimerState.PAUSED);
        } else if (isOnGoing) {
            setTimerState(TimerState.STARTED);
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

    const handleTimerStateChange: ToggleButtonGroupProps["onChange"] = async (
        _,
        value,
    ) => {
        const state = value[0] as TimerState;
        setTimerState(state);

        switch (state) {
            case TimerState.STARTED:
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
            case TimerState.PAUSED:
                if (currentSession && currentCountdown && currentProject) {
                    const paused = await pauseSession(
                        currentSession.id,
                        currentCountdown.id,
                        currentProject.id,
                    );
                    handleSessionUpdate(paused);
                }
                break;
            case TimerState.STOPPED:
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
                    handleResetTimer(endedSession);
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
                    handleResetTimer(latestSession);
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
                    handleResetTimer(endedSession);
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
            <ToggleButtonGroup onChange={handleTimerStateChange}>
                <ToggleButton
                    disabled={timerState !== TimerState.STARTED}
                    value={TimerState.PAUSED}
                >
                    <PauseIcon />
                </ToggleButton>
                <ToggleButton
                    disabled={timerState === TimerState.STARTED}
                    value={TimerState.STARTED}
                >
                    <PlayArrowIcon />
                </ToggleButton>
                <ToggleButton
                    disabled={timerState === TimerState.STOPPED}
                    value={TimerState.STOPPED}
                >
                    <StopIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
