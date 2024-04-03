"use client";

import { useState } from "react";
import { Box, IconButton, TextField, TextFieldProps } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { format } from "@formkit/tempo";

export default function NewNote() {
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    // SEC: handlers
    const onTitleChange: TextFieldProps["onChange"] = (event) => {
        setNoteTitle(event.target.value);
    };

    const onContentChange: TextFieldProps["onChange"] = (event) => {
        setNoteContent(event.target.value);
    };

    const handleAddNote = () => {};

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateRows: "min-content 1fr min-content",
                backgroundColor: "background.paper",
                p: 2,
                gap: 1,
            }}
        >
            <TextField
                value={noteTitle}
                onChange={onTitleChange}
                placeholder={format(new Date(), "HH:mm DD.MM.YYYY")}
                variant="filled"
            />
            <TextField
                multiline
                placeholder="Your note here..."
                value={noteContent}
                onChange={onContentChange}
                variant="outlined"
                rows={10}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <IconButton color="primary" onClick={handleAddNote}>
                    <AddCircleIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
