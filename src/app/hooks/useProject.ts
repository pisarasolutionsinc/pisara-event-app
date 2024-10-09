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

  const searchProject = async (query: string) => {
    try {
      const projects = await projectService.search(query);
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
