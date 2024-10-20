"use client";

import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
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
    httpEndSession,
    httpPauseSession,
    httpResumeSession,
    httpGetLatestSession,
} from "@/services/session";
import { httpCreateNewSession } from "@/services/projects";

enum TimerState {
    STOPPED = "STOPPED",
    STARTED = "STARTED",
    PAUSED = "PAUSED",
}

export default function Timer() {
    const {
        currentCountdown,
        currentProject,
        currentSession,
        setCurrentSession,
        setCurrentCountdown,
        setCurrentProject,
    } = useContext(WorkContext);
    const [timerState, setTimerState] = useState<TimerState>(
        TimerState.STOPPED,
    );
    const [sessionDisplay, setSessionDisplay] = useState("00:00");
    const [currDiff, setCurrDiff] = useState(100);
    const [maxDiff, setMaxDiff] = useState(100);
    const [isBreak, setIsBreak] = useState(false);

    // SEC: handlers
    const handleResetTimer = (breakTime: null | number) => {
        setTimerState(TimerState.STOPPED);
        setCurrentSession(null);
        const display = getTimeDisplay(
            breakTime ? breakTime : currentCountdown?.sessionTime,
            TimeUnit.MIN,
        );
        setSessionDisplay(display);
        if (currentCountdown) {
            setCurrDiff(100);
            setMaxDiff(100);
        } else {
            setCurrDiff(0);
            setMaxDiff(100);
        }
    };

    const handleSessionUpdate = (session: Session | null) => {
        // Handle stop
        if (!session) {
            handleResetTimer(session);
            return 0;
        }

        // Shared between stopwatch and countdowns
        setCurrentSession(session);
        const { isPaused, isOnGoing } = session;
        if (isPaused) {
            setTimerState(TimerState.PAUSED);
        } else if (isOnGoing) {
            setTimerState(TimerState.STARTED);
        }

        // Handle stopwatch
        if (session.isStopwatch) {
            // TODO: For now 1 hour
            // make this configurable and add a sound signal
            setMaxDiff(120 * 60);
            const sessionCurrent =
                getDiff(session.start, new Date(), TimeUnit.SECS) +
                session.accumulatedSeconds;
            setCurrDiff(sessionCurrent);
            const display = getTimeDisplay(sessionCurrent, TimeUnit.SECS);
            setSessionDisplay(display);
            return sessionCurrent;
        }

        // Handle countdowns
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
                    const resumed = await httpResumeSession(currentSession.id);
                    handleSessionUpdate(resumed);
                } else {
                    const newSession = await httpCreateNewSession(
                        currentProject?.id,
                        currentCountdown?.id,
                        isBreak,
                    );
                    setIsBreak(newSession.isBreak);
                    handleSessionUpdate(newSession);
                }
                break;
            case TimerState.PAUSED:
                if (currentSession) {
                    const paused = await httpPauseSession(currentSession.id);
                    handleSessionUpdate(paused);
                }
                break;
            case TimerState.STOPPED:
                if (currentSession) {
                    const endedSession = await httpEndSession(
                        currentSession.id,
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
        // Need to set sessionTime from countdown info
        // but only when there's no info from session
        if (currentSession) return;
        if (currentCountdown) {
            setSessionDisplay(
                getTimeDisplay(currentCountdown.sessionTime, TimeUnit.MIN),
            );
            setCurrDiff(100);
        }
        // For stopwatch set to 00:00
        else {
            setSessionDisplay("00:00");
            setCurrDiff(0);
        }
    }, [currentCountdown, currentSession]);

    // Retrieve session
    useEffect(() => {
        const retrieveLatestSession = async () => {
            const latestSession = await httpGetLatestSession();

            // No session retrieved -> do nothing
            if (!latestSession) return;

            const { countdown, project } = latestSession;
            handleSessionUpdate(latestSession);
            setCurrentCountdown(countdown);
            setCurrentProject(project);
            setIsBreak(false);
        };
        retrieveLatestSession();
    }, []);

    // Manage session changes
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (currentSession) {
            interval = setInterval(async () => {
                const secsLeft = handleSessionUpdate(currentSession);
                if (secsLeft < 0) {
                    const endedSession = await httpEndSession(
                        currentSession.id,
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
                cornerRadius="50%"
                sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: theme.palette.info.light,
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                    },
                })}
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
