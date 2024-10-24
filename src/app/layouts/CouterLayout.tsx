import { Outlet, useParams } from "react-router-dom";
import { TopNavigation } from "../components/navigation/TopNavigation";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { WEBAPP } from "../config/config";
import { useToast } from "../context/ToastProvider";
import { useProject } from "../hooks/useProject";

export const CounterLayout = () => {
  const { Logout, getUser, auth } = useAuth();
  const { showToast } = useToast();
  const { projectKey } = useParams();
  const { currentProject } = useProject();

  useEffect(() => {
    const fetch = async () => {
      if (auth && auth.user) {
        try {
          const user = await getUser(auth.user.id);
          console.log(user);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No user is logged in.");
      }
    };

    fetch();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col min-h-screen flex-1">
        <div>
          <TopNavigation>
            <TopNavigation.Item
              href={`${
                location.pathname === `/${projectKey}/event`
                  ? "/apps/event"
                  : location.pathname === `/${projectKey}/event/create`
                  ? `/${projectKey}/event`
                  : "/apps/event"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <img
                    src={currentProject?.image || WEBAPP.LOGO}
                    className="h-10"
                  />
                  <span className="text-xl font-bold text-gray-600">
                    {location.pathname === `/apps/event`
                      ? "Your Event Apps"
                      : currentProject?.name}
                  </span>
                </div>
              </div>
            </TopNavigation.Item>

            <TopNavigation.Item href={`${projectKey}/event`}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4 px-4 py-1">
                  {/* Render initials and name only if authData exists */}
                  {auth && auth.user ? (
                    <>
                      {/* Initials Circle */}
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-gray-800">
                        {auth.user.firstname[0]}
                        {auth.user.lastname[0]}
                      </div>
                      {/* User Name */}
                      <span className="text-gray-500 font-bold">
                        {auth.user.firstname} {auth.user.lastname}
                      </span>
                      {/* Logout Button */}
                      <button
                        className="ml-4 text-red-500 border border-red-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                        onClick={() => {
                          Logout();
                          showToast(
                            "Cover photo uploaded successfully",
                            "success",
                            "bottom-10 right-10"
                          );
                          setTimeout(() => {
                            window.location.reload();
                          }, 3000);
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 font-bold">Guest</span>
                  )}
                </div>
              </div>
            </TopNavigation.Item>
          </TopNavigation>
        </div>
        <div className="flex flex-col bg-[#fcfcfc] min-h-[calc(100%-4rem)] px-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
