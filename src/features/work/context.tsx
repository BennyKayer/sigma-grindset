"use client";

import { Countdown, Project } from "@prisma/client";
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
    setCurrentCountdown: Dispatch<SetStateAction<Countdown | null>>;
    setCurrentProject: Dispatch<SetStateAction<Project | null>>;
};
export const WorkContext = createContext<WorkContextType>({
    currentProject: null,
    currentCountdown: null,
    setCurrentCountdown: () => null,
    setCurrentProject: () => null,
});

type WorkProviderProps = PropsWithChildren<{}>;
export const WorkProvider = ({ children }: WorkProviderProps) => {
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [currentCountdown, setCurrentCountdown] = useState<Countdown | null>(
        null,
    );

    const value = {
        currentCountdown,
        currentProject,
        setCurrentCountdown,
        setCurrentProject,
    };

    return (
        <WorkContext.Provider value={value}>{children}</WorkContext.Provider>
    );
};
