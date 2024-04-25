"use client";

import {
    BoxProps,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
} from "@mui/material";
import { Countdown } from "@prisma/client";
import { useState, useEffect, useContext } from "react";
import { getUserCountdowns } from "@/services/countdown";
import SettingsIcon from "@mui/icons-material/Settings";
import { WorkContext } from "@/features/work";

type TimerListProps = {} & BoxProps;
export default function TimerList(props: TimerListProps) {
    const [countdowns, setCountdowns] = useState<Countdown[]>([]);
    const { setCurrentCountdown, currentCountdown, currentSession } =
        useContext(WorkContext);

    // SEC: handlers
    const handleSelectCountdown = (newCountdown: Countdown | null) => {
        setCurrentCountdown(newCountdown);
    };

    // SEC: useEffect
    useEffect(() => {
        const setupCountdowns = async () => {
            const userCountdowns = await getUserCountdowns();
            setCountdowns(userCountdowns);
        };
        setupCountdowns();
    }, []);

    return (
        <Box {...props}>
            <List
                sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid silver",
                    borderRadius: "15px",
                }}
            >
                <ListItem
                    disablePadding
                    sx={{
                        borderBottom: "1px solid silver",
                        padding: 2,
                    }}
                >
                    <Typography variant="h6">Timers</Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        disabled={!!currentSession}
                        selected={currentCountdown === null}
                        onClick={() => handleSelectCountdown(null)}
                    >
                        <ListItemText primary={"Stopwatch"} />
                    </ListItemButton>
                </ListItem>
                {countdowns.map((el) => {
                    const { id, name } = el;
                    return (
                        <ListItem
                            key={id}
                            secondaryAction={
                                <IconButton disabled={!!currentSession}>
                                    <SettingsIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                disabled={!!currentSession}
                                selected={id === currentCountdown?.id}
                                onClick={() => handleSelectCountdown(el)}
                            >
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
