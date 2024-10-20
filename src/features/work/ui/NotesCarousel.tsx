"use client";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
    Box,
    Divider,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { WorkContext } from "@/features/work/context";
import { httpGetProjectNotes } from "@/services/projects";

export default function NotesCarousel() {
    const { breakpoints } = useTheme();
    const isDesktop = useMediaQuery(breakpoints.up("lg"));
    const isLargeDesktop = useMediaQuery(breakpoints.up("xl"));
    const { currentProject, notes, setNotes } = useContext(WorkContext);
    const indexesDisplayed = isLargeDesktop
        ? [0, 1, 2]
        : isDesktop
          ? [0, 1]
          : [0];

    // SEC: handlers
    // This move is simply going to work in a pop / shift fashion
    // and we're always displaying first 3 items
    // 1 2 3 4 5 => 5 1 2 3 4
    const moveLeft = () => {
        const itemsCopy = [...notes];
        const last = itemsCopy.pop();
        if (last) {
            setNotes([last, ...itemsCopy]);
        }
    };

    // 1 2 3 4 5 => 2 3 4 5 1
    const moveRight = () => {
        const itemsCopy = [...notes];
        const first = itemsCopy.shift();
        if (first) {
            setNotes([...itemsCopy, first]);
        }
    };

    // SEC: useEffect
    useEffect(() => {
        if (currentProject) {
            const setupProjectsNotes = async () => {
                const projectNotes = await httpGetProjectNotes(
                    currentProject?.id,
                );
                setNotes(projectNotes);
            };
            setupProjectsNotes();
        }
    }, [currentProject]);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "min-content 1fr min-content",
                alignItems: "center",
                justifyItems: "center",
                p: 1,
            }}
        >
            <IconButton onClick={moveLeft} disabled={notes.length < 3}>
                <ArrowLeftIcon />
            </IconButton>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    height: "100%",
                    alignItems: "center",
                }}
            >
                {notes
                    .filter((_, index) => index in indexesDisplayed)
                    .map((el) => {
                        return (
                            <Box
                                key={el.id}
                                sx={{
                                    backgroundColor: "background.paper",
                                    height: "80%",
                                    width: "100%",
                                    borderRadius: 1,
                                    padding: 2,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        borderBottom: "1px solid silver",
                                    }}
                                >
                                    {el.header}
                                </Typography>
                                <Divider />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        padding: "8px",
                                    }}
                                >
                                    {el.content}
                                </Typography>
                            </Box>
                        );
                    })}
            </Box>
            <IconButton onClick={moveRight} disabled={notes.length < 3}>
                <ArrowRightIcon />
            </IconButton>
        </Box>
    );
}
