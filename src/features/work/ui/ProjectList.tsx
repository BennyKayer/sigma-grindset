"use client";

import {
    Box,
    BoxProps,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { getProjects, patchProject, postNewProject } from "@/services/projects";
import { useEffect, useState, useContext } from "react";
import { Project } from "@prisma/client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import { WorkContext } from "@/features/work/context";

type AugmentedProject = {
    editing?: boolean;
    editText?: string;
} & Project;

type ProjectListProps = {} & BoxProps;
export default function ProjectList(props: ProjectListProps) {
    const [projects, setProjects] = useState<AugmentedProject[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [projectNameError, setProjectNameError] = useState(false);
    const { setCurrentProject, currentProject } = useContext(WorkContext);

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
        setNewProjectName("");
    };

    const handleCurrentProjectChange = (newProject: Project) => {
        setCurrentProject(newProject);
    };

    const handleEditProjects = (project: AugmentedProject) => {
        const newProjects = projects.map((el) => {
            // User can click edit on other items
            // we wan't to find these stragglers and update them
            if (el.editing) {
                // Only patch when there's edit text
                // then clear it
                if (el.editText) {
                    patchProject(el.editText, el.id);
                    return {
                        ...el,
                        name: el.editText,
                        editText: undefined,
                        editing: false,
                    };
                }
                return { ...el, editing: false };
            }
            // If the target matches start / stop editing
            if (el.id === project.id) {
                return {
                    ...el,
                    editing: !el.editing,
                };
            }
            return el;
        });
        console.log(newProjects);

        setProjects(newProjects);
    };

    const handleEditProjectName = (
        project: AugmentedProject,
        newName: string,
    ) => {
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
            if (projects.length) {
                setCurrentProject(projects[0]);
            }
        };
        setupProjects();
    }, []);

    return (
        <Box {...props}>
            <List
                sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {projects.map((el) => {
                    const { id, name, editing } = el;
                    return (
                        <ListItem
                            key={id}
                            secondaryAction={
                                <IconButton
                                    onClick={() => handleEditProjects(el)}
                                >
                                    {editing ? <EditOffIcon /> : <EditIcon />}
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                onClick={() => handleCurrentProjectChange(el)}
                                selected={currentProject?.id === id}
                            >
                                {editing ? (
                                    <TextField
                                        variant="standard"
                                        size="small"
                                        defaultValue={el.name}
                                        autoFocus
                                        onChange={(e) =>
                                            handleEditProjectName(
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
                        value={newProjectName}
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
