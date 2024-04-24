"use client";

import { Countdown, Note, Project } from "@prisma/client";
import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useState,
} from "react";

type WorkContextType = {
    currentProject: Project | null;
    currentCountdown: Countdown | null;
    notes: Note[];
    setCurrentCountdown: Dispatch<SetStateAction<Countdown | null>>;
    setCurrentProject: Dispatch<SetStateAction<Project | null>>;
    setNotes: Dispatch<SetStateAction<Note[]>>;
};
export const WorkContext = createContext<WorkContextType>({
    currentProject: null,
    currentCountdown: null,
    notes: [],
    setCurrentCountdown: () => null,
    setCurrentProject: () => null,
    setNotes: () => null,
});

type WorkProviderProps = PropsWithChildren<{}>;
export const WorkProvider = ({ children }: WorkProviderProps) => {
    const [currentProject, setCurrentProject] =
        useState<WorkContextType["currentProject"]>(null);
    const [currentCountdown, setCurrentCountdown] =
        useState<WorkContextType["currentCountdown"]>(null);
    const [notes, setNotes] = useState<WorkContextType["notes"]>([]);

    const value = {
        currentCountdown,
        currentProject,
        notes,
        setCurrentCountdown,
        setCurrentProject,
        setNotes,
    };

    return (
        <WorkContext.Provider value={value}>{children}</WorkContext.Provider>
    );
};
