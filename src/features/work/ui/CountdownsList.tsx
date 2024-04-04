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
import { useState, useEffect, MouseEventHandler } from "react";
import { getUserCountdowns } from "@/services/countdown";
import SettingsIcon from "@mui/icons-material/Settings";

type CountdownsProps = {} & BoxProps;
export default function Countdowns(props: CountdownsProps) {
    const [countdowns, setCountdowns] = useState<Countdown[]>([]);
    const [currentCountdownId, setCurrentCountdownId] =
        useState<Countdown["id"]>("");

    // SEC: handlers
    const handleSelectCountdown = (newCountdownId: string) => {
        setCurrentCountdownId(newCountdownId);
    };

    // SEC: useEffect
    useEffect(() => {
        const setupCountdowns = async () => {
            const userCountdowns = await getUserCountdowns();
            setCountdowns(userCountdowns);
            if (userCountdowns.length) {
                setCurrentCountdownId(userCountdowns[0].id);
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
                                selected={id === currentCountdownId}
                                onClick={() => handleSelectCountdown(id)}
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
