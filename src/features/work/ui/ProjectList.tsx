"use client";

import {
    Autocomplete,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Radio,
    RadioGroup,
    RadioGroupProps,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { getProjects, postNewProject } from "@/services/projects";
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type AugmentedProject = {
    editing?: boolean;
    editText?: string;
} & Project;

export default function ProjectList() {
    const [projects, setProjects] = useState<AugmentedProject[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [projectNameError, setProjectNameError] = useState(false);
    const [currentProjectId, setCurrentProjectId] =
        useState<AugmentedProject["id"]>("");

    // SEC: handlers
    const handleNewProjectNameChange: TextFieldProps["onChange"] = (event) => {
        const { value } = event.target;

        if (value.length) {
            setProjectNameError(false);
        } else {
            setProjectNameError(true);
        }

        setNewProjectName(value);
    };

    const handleNewProjectAdd = async () => {
        if (!newProjectName.length) {
            setProjectNameError(true);
            return;
        }

        const newProject = await postNewProject(newProjectName);
        setProjects([...projects, newProject]);
    };

    const handleCurrentProjectChange: RadioGroupProps["onChange"] = (event) => {
        const { value } = event.target;
        setCurrentProjectId(value);
    };

    const handleEditProjectStart = (project: AugmentedProject) => {
        const newProjects = projects.map((el) => {
            if (el.editing) {
                return {
                    ...el,
                    name: el.editText ? el.editText : el.name,
                    editing: false,
                };
            }
            if (el.id === project.id) {
                return {
                    ...el,
                    editing: !el.editing,
                };
            }
            return el;
        });
        setProjects(newProjects);
    };

    const handleEditProject = (project: AugmentedProject, newName: string) => {
        const updated = projects.map((el) => {
            if (el.id === project.id) {
                return {
                    ...project,
                    editText: newName,
                };
            }
            return el;
        });
        setProjects(updated);
    };

    // SEC: useEffect
    useEffect(() => {
        const setupProjects = async () => {
            const projects = await getProjects();
            setProjects(projects);
            setProjects(projects);
            if (projects.length) {
                setCurrentProjectId(projects[0].id);
            }
        };
        setupProjects();
    }, []);

    return (
        <Box>
            <List
                sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <ListItem sx={{ p: 2 }}>
                    {/* TODO: Filtering */}
                    <Autocomplete
                        disablePortal
                        options={projects.map((el) => el.name)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                label="Search..."
                            />
                        )}
                        sx={{ width: "100%" }}
                    />
                </ListItem>
                <RadioGroup
                    value={currentProjectId}
                    onChange={handleCurrentProjectChange}
                >
                    {projects.map((el) => {
                        const { id, name, editing } = el;
                        return (
                            <ListItem
                                key={id}
                                secondaryAction={<Radio value={id} />}
                                disablePadding
                            >
                                <ListItemButton
                                    onClick={() => handleEditProjectStart(el)}
                                    selected={currentProjectId === id}
                                >
                                    {editing ? (
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            defaultValue={el.name}
                                            autoFocus
                                            onChange={(e) =>
                                                handleEditProject(
                                                    el,
                                                    e.target.value,
                                                )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <ListItemText id={id} primary={name} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </RadioGroup>
                <ListItem
                    secondaryAction={
                        <IconButton
                            onClick={handleNewProjectAdd}
                            color="primary"
                        >
                            <AddCircleIcon fontSize="medium" />
                        </IconButton>
                    }
                    sx={{
                        mt: "auto",
                    }}
                >
                    <TextField
                        onChange={handleNewProjectNameChange}
                        placeholder="New Project"
                        variant="outlined"
                        size="small"
                        sx={{
                            width: "100%",
                            pr: 1,
                        }}
                        error={projectNameError}
                    />
                </ListItem>
            </List>
        </Box>
    );
}
