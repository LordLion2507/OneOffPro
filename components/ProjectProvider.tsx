'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { projects } from '@/data/projects';

type ProjectContextValue = {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  projectOptions: string[];
};

const STORAGE_KEY = 'selectedProjectId';

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProjectState] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) ?? '';
    return projects.some((project) => project.projectId === stored) ? stored : '';
  });

  const setSelectedProject = (projectId: string) => {
    setSelectedProjectState(projectId);

    if (projectId) {
      window.localStorage.setItem(STORAGE_KEY, projectId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<ProjectContextValue>(
    () => ({
      selectedProject,
      setSelectedProject,
      projectOptions: projects.map((project) => project.projectId),
    }),
    [selectedProject]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjectSelection() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectSelection must be used inside ProjectProvider');
  }

  return context;
}
