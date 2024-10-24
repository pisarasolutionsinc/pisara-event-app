import { useNavigate } from "react-router-dom";

import { ProjectCard } from "../../../../components/cards/ProjectCards";

type ProjectListProps = {
  projects?: any[];
};

export const ProjectList = ({ projects }: ProjectListProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
          {projects.map((project, index) => (
            <div key={index}>
              <ProjectCard
                card={{
                  title: project.name,
                }}
                onClick={() => navigate(`/${project.key}/event`)}
                className="cursor-pointer shadow-md border hover:shadow-2xl h- transition-shadow duration-200  "
              >
                <div className="flex justify-between items-center">
                  <ProjectCard.KebabMenu className="  shadow-none">
                    <ProjectCard.KebabMenu.Item onClick={() => alert("Clone")}>
                      Clone
                    </ProjectCard.KebabMenu.Item>
                    <ProjectCard.KebabMenu.Item onClick={() => alert("Delete")}>
                      Delete
                    </ProjectCard.KebabMenu.Item>
                  </ProjectCard.KebabMenu>
                </div>
                <ProjectCard.Image className="bg-blue-300" />
                <ProjectCard.Title className="text-gray-700 font-semibold px-2 " />
              </ProjectCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4"></div>
      )}
    </div>
  );
};
