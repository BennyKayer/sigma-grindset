"use client";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Divider, IconButton } from "@mui/material";
import { useState } from "react";

const MOCK = [
    {
        id: 1,
        title: "10:22 03.04.2024",
        content: "Working on Notes carousel #1",
    },
    {
        id: 2,
        title: "9:30 03.04.2024",
        content: "Working on New Note editor #2",
    },
    {
        id: 3,
        title: "15:23, 02.04.2024",
        content: "Working on project's list #3",
    },
    {
        id: 4,
        title: "12:22, 02.04.2024",
        content: "Fixing the 401 issue #4",
    },
    {
        id: 5,
        title: "10:22, 02.04.2024",
        content: "Basics of projects list #5",
    },
];

export default function NotesCarousel() {
    const [items, setItems] = useState(MOCK);

    // This move is simply going to work in a pop / shift fashion
    // and we're always displaying first 3 items
    // 1 2 3 4 5 => 5 1 2 3 4
    const moveLeft = () => {
        const itemsCopy = [...items];
        const last = itemsCopy.pop();
        if (last) {
            setItems([last, ...itemsCopy]);
        }
    };

    // 1 2 3 4 5 => 2 3 4 5 1
    const moveRight = () => {
        const itemsCopy = [...items];
        const first = itemsCopy.shift();
        if (first) {
            setItems([...itemsCopy, first]);
        }
    };

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
            <IconButton onClick={moveLeft}>
                <ArrowLeftIcon />
            </IconButton>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}
            >
                {items
                    .filter((_, index) => index in [0, 1, 2])
                    .map((el) => {
                        return (
                            <Box
                                key={el.id}
                                sx={{
                                    backgroundColor: "background.paper",
                                    width: "200px",
                                    height: "200px",
                                }}
                            >
                                {el.title}
                                <Divider />
                                {el.content}
                            </Box>
                        );
                    })}
            </Box>
            <IconButton onClick={moveRight}>
                <ArrowRightIcon />
            </IconButton>
        </Box>
    );
}
