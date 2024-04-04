"use client";

import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useState, useContext } from "react";
import { WorkContext } from "@/features/work";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

enum CountdownState {
    STOPPED = "STOPPED",
    STARTED = "STARTED",
    PAUSED = "PAUSED",
}

export default function Countdown() {
    const { currentCountdown } = useContext(WorkContext);
    const [minutes, setMinutes] = useState("00:00");
    const [countdownState, setCountdownState] = useState<CountdownState>(
        CountdownState.STOPPED,
    );

    // SEC: handlers
    const handleCountdownStateChange: ToggleButtonGroupProps["onChange"] = (
        _,
        value,
    ) => {
        setCountdownState(value[0]);
    };

    // SEC: useEffect
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setMinutes(minutes - 1);
    //     }, 1000);

    //     if (minutes <= 0) {
    //         clearInterval(interval);
    //     }

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [minutes, setMinutes]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Gauge
                value={25}
                valueMax={100}
                height={300}
                width={300}
                startAngle={0}
                endAngle={360}
                text={({ value, valueMax }) => {
                    return `${value} / ${valueMax}`;
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
