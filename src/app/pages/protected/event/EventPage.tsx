import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { EventList } from "./features/EventList";
import { HeaderEvent } from "./features/HeaderEvent";

export const EventPage = () => {
  const { currentProject: project, loading, error } = useProject();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("list");
  // const projectStatuses = getCurrentProjectStatuses(project);
  // console.log(projectStatuses);

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab === "reports" ? "reports" : "list");
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <HeaderEvent activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "list" && (
        <>
          {project ? (
            <EventList projectId={project._id!} projectKey={project.key!} />
          ) : (
            <div>Project not found</div>
          )}
        </>
      )}
    </div>
  );
};
