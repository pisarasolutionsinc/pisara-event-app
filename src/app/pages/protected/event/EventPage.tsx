import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { Project } from "../../../models/projectModels";

export const EventPage = () => {
  const { projectKey } = useParams();
  const { searchProject } = useProject();
  const [project, setProject] = useState<Project[]>([]);

  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    document.title = project[0] && project[0]?.name ? project[0]?.name : "";
  }, [project]);

  const fetchEvent = async () => {
    try {
      const query: any = {
        key: projectKey,
      };

      const result = await searchProject(
        query,
        ["name", "itemTypes", "board"],
        [],
        1,
        0,
        "",
        true
      );
      setProject(result);
    } catch (error) {}
  };

  return <div>EventPage {projectKey}</div>;
};
