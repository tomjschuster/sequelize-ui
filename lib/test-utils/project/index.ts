import { DirectoryItem, ProjectType } from "@lib/core";
import { NpmProject } from "./npm";

export const buildProject = (
  projectType: ProjectType,
  directory: DirectoryItem,
  preinstall?: string
): Promise<void> => {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.build(directory, preinstall);
  }
};

export const destroyProject = (
  projectType: ProjectType,
  name: string
): Promise<void> => {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.destroy(name);
  }
};
