import { useEffect, useState } from "react";
import { Project } from "../models/projectModels";
import { ProjectService } from "../services/projectService";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../utils/useLocalStorage";
import { WEBAPP } from "../config/config";
import { useAuth } from "./useAuth";
import { isPathName } from "../utils/usePath";

interface Status {
  _id: string;
  name: string;
  category: string;
}

type Field = {
  name?: string;
  category?: string;
};

type GetCurrentProjectFieldsParams = {
  itemType?: string;
  exclusions?: string[];
};

export const useProject = () => {
  const { projectKey } = useParams();
  const projectService = new ProjectService();
  const { auth } = useAuth();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { saveLocal } = useLocalStorage();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectKey === "undefined") {
      navigate("/apps/event");
    }
  }, [projectKey, navigate]);

  //SUB FUNCTIONS

  useEffect(() => {
    isPathName([`/${projectKey}/event`, `/${projectKey}/event/create`], () => {
      searchCurrentProject();
    });

    if (location.pathname === "/apps/event") {
      fetchProjects();
    }
  }, [projectKey]);

  useEffect(() => {
    if (currentProject) {
      const projectName = currentProject?.name || WEBAPP.NAME;
      document.title = projectName;
      saveLocal("projectName", projectName);
    }
  }, [currentProject, saveLocal]);

  const searchCurrentProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        key: projectKey,
      };

      const params = {
        query: query,
        select: ["name", "itemTypes", "board", "key"],
        populate: ["itemTypes.fields", "itemTypes.type", "itemTypes.workflow"],
        lean: true,
      };

      const result = await searchProjects(params);
      setCurrentProject(result[0]);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        owner: auth?.user?.id,
        // "itemTypes.type.name": "Project",
      };

      const params = {
        query: query,
        select: ["name", "itemTypes", "board", "key"],
        populate: ["itemTypes.fields", "itemTypes.type", "itemTypes.workflow"],
        lean: true,
      };

      const result = await searchProjects(params);
      setProjects(result);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  function ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getProjectsByItemTypeName(
    projects: any[],
    itemTypeName: string
  ): any[] {
    return projects.filter((project) =>
      project.itemTypes.some(
        (itemType: any) => itemType.type.name === itemTypeName
      )
    );
  }

  function getCurrentProjectStatuses(currentProject: Project | null):
    | Array<{
        id: string;
        title: string;
        column: string;
        category: string;
      }>
    | undefined {
    if (!currentProject || !currentProject.itemTypes) return;

    const allStatuses: Status[] = currentProject.itemTypes.flatMap(
      (itemType: any) => itemType.workflow?.statuses || []
    );

    return Array.from(new Set(allStatuses.map((status) => status.name)))
      .map((name) => allStatuses.find((status) => status.name === name)!)
      .map((status) => ({
        id: status._id,
        title: ucFirst(status.name),
        column: status.name.toLowerCase().replace(/ /g, "-"),
        category: status.category,
      }));
  }

  function getCurrentProjectFields(
    currentProject: Project | null,
    { itemType, exclusions = [] }: GetCurrentProjectFieldsParams
  ): Field[] | undefined {
    if (
      !currentProject ||
      !currentProject.itemTypes ||
      currentProject.itemTypes.length === 0
    ) {
      return;
    }

    const commonFields: any[] = currentProject.itemTypes[0].fields.filter(
      (field: any) =>
        !exclusions.includes(field.name) && field.category === "common"
    );

    const customFields: any[] = itemType
      ? currentProject.itemTypes
          .find((itemTypeEntry: any) => itemTypeEntry.type.name === itemType)
          ?.fields.filter(
            (field: any) =>
              !exclusions.includes(field.name) && field.category === "custom"
          ) || []
      : [];

    return [...commonFields, ...customFields];
  }

  function getCurrentProjectCommonFields(
    currentProject: Project | null,
    { exclusions = [] }: GetCurrentProjectFieldsParams
  ): Field[] | undefined {
    if (
      !currentProject ||
      !currentProject.itemTypes ||
      currentProject.itemTypes.length === 0
    ) {
      return;
    }

    const commonFields: any[] = currentProject.itemTypes[0].fields.filter(
      (field: any) =>
        !exclusions.includes(field.name) && field.category === "common"
    );

    return [...commonFields];
  }

  function getCurrentProjectCustomFields(
    currentProject: Project | null,
    { itemType, exclusions = [] }: GetCurrentProjectFieldsParams
  ): Field[] | undefined {
    if (
      !currentProject ||
      !currentProject.itemTypes ||
      currentProject.itemTypes.length === 0
    ) {
      return;
    }

    const customFields: any[] = itemType
      ? currentProject.itemTypes
          .find((itemTypeEntry: any) => itemTypeEntry.type.name === itemType)
          ?.fields.filter(
            (field: any) =>
              !exclusions.includes(field.name) && field.category === "custom"
          ) || []
      : [];

    return [...customFields];
  }

  //MAIN FUNCTIONS
  const getProject = async (id: string) => {
    try {
      const project = await projectService.get(id);
      return project;
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      const projects = await projectService.getAll();
      return projects;
    } catch (error) {
      console.log(error);
    }
  };

  const searchProjects = async (params: any) => {
    try {
      const projects = await projectService.search(params);
      return projects;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    //MAIN
    getProject,
    getProjects,
    searchProjects,
    //SUB
    projectKey,
    currentProject,
    projects,
    loading,
    error,
    getCurrentProjectStatuses,
    getCurrentProjectFields,
    getCurrentProjectCommonFields,
    getCurrentProjectCustomFields,
    getProjectsByItemTypeName,
  };
};
