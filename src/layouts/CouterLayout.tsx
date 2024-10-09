import { Outlet } from "react-router-dom";
import { TopNavigation } from "../components/navigation/TopNavigation";
import { ASSET } from "../config/assets";
import { useLocalStorage } from "../app/utils/useLocalStorage";
import { useAuth } from "../app/hooks/useAuth";
import { useEffect } from "react";

export const CounterLayout = () => {
  const { Logout, getUser } = useAuth();
  const { getLocal } = useLocalStorage();

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await getUser(getLocal("auth").user.id);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col min-h-screen flex-1">
        <div>
          <TopNavigation>
            <TopNavigation.Item href="/">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <img
                    src={ASSET.LOGIN_LOGO}
                    alt="Kadiwa Event Logo"
                    className="h-10"
                  />
                  <span className="text-xl font-bold text-gray-600">
                    KADIWA EVENT
                  </span>
                </div>
              </div>
            </TopNavigation.Item>

            <TopNavigation.Item href="/dashboard">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4  border rounded-full px-4 py-1">
                  {/* Initials Circle */}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-gray-800">
                    {getLocal("auth").user.firstname[0]}
                    {getLocal("auth").user.lastname[0]}
                  </div>
                  {/* User Name */}
                  <span className="text-gray-500 font-bold ">
                    {getLocal("auth").user.firstname}{" "}
                    {getLocal("auth").user.lastname}
                  </span>
                  {/* Logout Button */}
                  <button
                    className="ml-4 text-red-500 border border-red-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                    onClick={() => {
                      Logout();
                      setTimeout(() => {
                        localStorage.removeItem("auth");
                        sessionStorage.removeItem("auth");
                        window.location.reload();
                      }, 3000);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </TopNavigation.Item>
          </TopNavigation>
        </div>
        <div className="flex flex-col  bg-[#fcfcfc] min-h-[calc(100%-4rem)]">
          <Outlet />
        </div>{" "}
      </div>
    </div>
  );
};
