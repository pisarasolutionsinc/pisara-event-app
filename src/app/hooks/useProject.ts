import { ProjectService } from "../services/projectService";

export const useProject = () => {
  const projectService = new ProjectService();

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
    getProject,
    getProjects,
    searchProject,
  };
};
