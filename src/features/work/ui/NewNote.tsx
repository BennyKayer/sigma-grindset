"use client";

import { useContext, useState } from "react";
import { Box, IconButton, TextField, TextFieldProps } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { format } from "@formkit/tempo";
import { postProjectNote } from "@/services/projects";
import { WorkContext } from "@/features/work";

export default function NewNote() {
    const { currentProject, setNotes, notes } = useContext(WorkContext);

    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    // SEC: handlers
    const onTitleChange: TextFieldProps["onChange"] = (event) => {
        setNoteTitle(event.target.value);
    };

    const onContentChange: TextFieldProps["onChange"] = (event) => {
        setNoteContent(event.target.value);
    };

    const handleAddNote = async () => {
        if (currentProject) {
            const newNote = await postProjectNote(currentProject.id, {
                header: noteTitle.length ? noteTitle : undefined,
                content: noteContent,
            });
            setNotes([...notes, newNote]);
        }
    };

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
                <IconButton
                    color="primary"
                    onClick={handleAddNote}
                    disabled={!currentProject}
                >
                    <AddCircleIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
