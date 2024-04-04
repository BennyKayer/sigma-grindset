"use client";

import {
    BoxProps,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
} from "@mui/material";
import { Countdown } from "@prisma/client";
import { useState, useEffect, useContext } from "react";
import { getUserCountdowns } from "@/services/countdown";
import SettingsIcon from "@mui/icons-material/Settings";
import { WorkContext } from "@/features/work";

type CountdownsListProps = {} & BoxProps;
export default function CountdownsList(props: CountdownsListProps) {
    const [countdowns, setCountdowns] = useState<Countdown[]>([]);
    const { setCurrentCountdown, currentCountdown } = useContext(WorkContext);

    // SEC: handlers
    const handleSelectCountdown = (newCountdown: Countdown | null) => {
        setCurrentCountdown(newCountdown);
    };

    // SEC: useEffect
    useEffect(() => {
        const setupCountdowns = async () => {
            const userCountdowns = await getUserCountdowns();
            setCountdowns(userCountdowns);
            if (userCountdowns.length) {
                setCurrentCountdown(userCountdowns[0]);
            }
        };
        setupCountdowns();
    }, []);

    return (
        <Box {...props}>
            <List
                sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "background.paper",
                }}
            >
                <ListItem disablePadding>
                    <ListItemButton
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
                                <IconButton>
                                    <SettingsIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton
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
