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
import { patchEndSession } from "@/services/session";

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
    const handleCountdownStateChange: ToggleButtonGroupProps["onChange"] = (
        _,
        value,
    ) => {
        const state = value[0] as CountdownState;
        setCountdownState(state);
    };

    // SEC: useEffect
    // Retrieve session
    useEffect(() => {
        const retrieveLatestSession = async () => {
            const latestSession = await getLatestSession(currentProject?.id);
            setCurrentSession(latestSession);

            const diff = getDiff(new Date(), latestSession?.stop);
            // Retrieved session is overdue, end it
            if (diff < 0 && latestSession) {
                await patchEndSession(latestSession.id);
                setCurrentSession(null);
            }
        };
        if (currentProject?.id) {
            retrieveLatestSession();
        }
    }, [currentProject]);

    // Manage countdown state changes
    useEffect(() => {
        let interval: any; // TODO: Types

        const handleNewSession = async () => {
            switch (countdownState) {
                case CountdownState.STARTED:
                    const newSession = await createNewSession(
                        currentProject?.id,
                        {
                            sessionTime: currentCountdown
                                ? currentCountdown.sessionTime
                                : null,
                        },
                    );
                    const diff = getDiff(new Date(), newSession.stop);
                    setMaxDiff(getDiff(newSession.start, newSession.stop));
                    setCurrDiff(diff);
                    const display = getTimeDisplay(diff, TimeUnit.MS);
                    setSessionDisplay(display);
                    setCurrentSession(newSession);
                    break;
                default:
                    break;
            }
        };

        if (currentSession) {
            const { isOnGoing, isPaused } = currentSession;
            if (isOnGoing) {
                setCountdownState(CountdownState.STARTED);
            }
            if (isPaused) {
                setCountdownState(CountdownState.PAUSED);
            }

            interval = setInterval(() => {
                const { stop: stopTime } = currentSession;

                const diff = getDiff(new Date(), stopTime);
                setCurrDiff(diff);
                setMaxDiff(getDiff(currentSession.start, currentSession.stop));
                const display = getTimeDisplay(diff, TimeUnit.MS);
                setSessionDisplay(display);
            }, 800);
        } else {
            handleNewSession();
        }

        return () => {
            clearInterval(interval);
        };
    }, [countdownState, currentSession]);

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
                text={() => {
                    return countdownState === CountdownState.STARTED
                        ? sessionDisplay
                        : `${getTimeDisplay(currentCountdown?.sessionTime, TimeUnit.MIN)}`;
                }}
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
