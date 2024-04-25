"use client";

import { Countdown, Note, Project, Session } from "@prisma/client";
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
    currentSession: Session | null;
    setCurrentCountdown: Dispatch<SetStateAction<Countdown | null>>;
    setCurrentProject: Dispatch<SetStateAction<Project | null>>;
    setNotes: Dispatch<SetStateAction<Note[]>>;
    setCurrentSession: Dispatch<SetStateAction<Session | null>>;
};
export const WorkContext = createContext<WorkContextType>({
    currentProject: null,
    currentCountdown: null,
    notes: [],
    currentSession: null,
    setCurrentCountdown: () => null,
    setCurrentProject: () => null,
    setNotes: () => null,
    setCurrentSession: () => null,
});

type WorkProviderProps = PropsWithChildren<{}>;
export const WorkProvider = ({ children }: WorkProviderProps) => {
    const [currentProject, setCurrentProject] =
        useState<WorkContextType["currentProject"]>(null);
    const [currentCountdown, setCurrentCountdown] =
        useState<WorkContextType["currentCountdown"]>(null);
    const [notes, setNotes] = useState<WorkContextType["notes"]>([]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);

    const value = {
        currentCountdown,
        currentProject,
        notes,
        currentSession,
        setCurrentCountdown,
        setCurrentProject,
        setNotes,
        setCurrentSession,
    };

    return (
        <WorkContext.Provider value={value}>{children}</WorkContext.Provider>
    );
};
