"use client";

import { Box } from "@mui/material";
import {
    TimerList,
    NewNote,
    NotesCarousel,
    ProjectList,
    Timer,
} from "@/features/work";

export default function WorkPage() {
    return (
        <Box
            sx={(theme) => ({
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gridTemplateRows: "repeat(2, 42vh)",
                gap: 4,
                [theme.breakpoints.down("lg")]: {
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "unset",
                },
            })}
        >
            <ProjectList
                sx={(theme) => ({
                    gridRow: "1 / span 2",
                    [theme.breakpoints.down("lg")]: {
                        height: "50vh",
                        overflow: "auto",
                    },
                })}
            />
            <Box
                sx={(theme) => ({
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 1,
                    [theme.breakpoints.down("lg")]: {
                        gridTemplateColumns: "1fr 1fr",
                    },
                    [theme.breakpoints.down("md")]: {
                        gridTemplateColumns: "1fr",
                    },
                })}
            >
                <NewNote />
                <NotesCarousel />
            </Box>
            <Box
                sx={(theme) => ({
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 1,
                    [theme.breakpoints.down("lg")]: {
                        gridTemplateColumns: "1fr 1fr",
                    },
                    [theme.breakpoints.down("md")]: {
                        gridTemplateColumns: "1fr",
                    },
                })}
            >
                <TimerList />
                <Timer />
            </Box>
        </Box>
    );
}
