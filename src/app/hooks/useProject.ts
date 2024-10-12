import { useEffect, useState } from "react";
import { Project } from "../models/projectModels";
import { ProjectService } from "../services/projectService";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "../utils/useLocalStorage";
import { WEBAPP } from "../config/config";

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
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { saveLocal } = useLocalStorage();

  //SUB FUNCTIONS

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = {
          key: projectKey,
        };

        const result = await searchProject(
          query,
          ["name", "itemTypes", "board", "key"],
          ["itemTypes.fields", "itemTypes.type", "itemTypes.workflow"],
          1,
          0,
          "",
          true
        );
        setCurrentProject(result[0]);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (projectKey) {
      fetchEvent();
    }
  }, [projectKey]);

  useEffect(() => {
    if (currentProject) {
      const projectName = currentProject?.name || WEBAPP.NAME;
      document.title = projectName;
      saveLocal("projectName", projectName);
    }
  }, [currentProject, saveLocal]);

  function ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  const searchProject = async (
    query: any = {},
    select: string[] = [],
    populate: string[] = [],
    limit: number = 10,
    page: number = 1,
    sort: string = "-createdAt",
    lean: boolean = false
  ) => {
    try {
      const projects = await projectService.search(
        query,
        select,
        populate,
        limit,
        page,
        sort,
        lean
      );
      return projects;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    //MAIN
    getProject,
    getProjects,
    searchProject,
    //SUB
    projectKey,
    currentProject,
    loading,
    error,
    getCurrentProjectStatuses,
    getCurrentProjectFields,
    getCurrentProjectCommonFields,
    getCurrentProjectCustomFields,
  };
};
