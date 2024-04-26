"use client";

import { useContext, useState } from "react";
import { Box, IconButton, TextField, TextFieldProps } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { format, isBefore } from "@formkit/tempo";
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
        if (currentProject && noteContent.length) {
            const newNote = await postProjectNote(currentProject.id, {
                header: noteTitle.length ? noteTitle : undefined,
                content: noteContent,
            });
            // Restore original order of notes pre reassigning them
            const sortedNotes = notes.sort((a, b) =>
                isBefore(new Date(a.updatedAt), new Date(b.updatedAt)) ? 1 : -1,
            );
            setNotes([newNote, ...sortedNotes]);
            setNoteContent("");
            setNoteTitle("");
        }
    };

    const handleEnter: TextFieldProps["onKeyDown"] = (e) => {
        const { code, shiftKey } = e;
        if (code === "Enter") {
            if (!shiftKey) {
                e.preventDefault();
                handleAddNote();
            }
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateRows: "min-content 1fr min-content",
                p: 2,
                gap: 1,
                border: "1px solid silver",
                borderRadius: "15px",
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
                placeholder={`Your note here...\nShift + Enter for new line\nEnter to submit`}
                value={noteContent}
                onChange={onContentChange}
                variant="outlined"
                rows={10}
                onKeyDown={handleEnter}
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
