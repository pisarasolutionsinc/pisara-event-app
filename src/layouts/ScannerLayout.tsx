import { useState } from "react";
import { ReactNode } from "react";
import { SideNavigation } from "../components/navigation/SideNavigation";
import { app } from "./../config/app";
import { Sling as Hamburger } from "hamburger-react";
import { AttendanceMain } from "../pages/event/AttendanceMain";

type TNavigation = {
  key: string;
  name: string;
  path?: string;
  type: string;
  submenu?: TNavigation[];
  icon: ReactNode;
};

const ScannerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Toggle sidebar visibility in mobile view only
  const toggleSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
        } bg-slate-900 text-white border-r border-slate-800 w-[60%] sm:w-[60%]  md:w-[20%] lg:w-[20%]  xl:w-[15%]   `}
      >
        <div className="flex justify-between  p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold">ORO</h2>
          <button className="p-2 md:hidden" onClick={toggleSidebar}>
            {/* Close Button */}
            <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} />
          </button>
        </div>
        <SideNavigation groupBehavior="multiple" className="gap-10">
          <SideNavigationContent />
        </SideNavigation>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-[20%] lg:ml-[20%] xl:ml-[15%]" : "ml-0"
        }`}
      >
        <div className="flex justify-between items-center p-5 md:hidden">
          <button onClick={toggleSidebarOnMobile} className="  text-gray-500 ">
            {/* Hamburger Button */}
            <Hamburger
              toggled={isSidebarOpen}
              toggle={toggleSidebarOnMobile}
              size={20}
            />
          </button>
          {/* <h1 className="text-xl font-bold ">Oro</h1> */}
        </div>
        <div className="flex flex-col bg-[#ebebeb] min-h-screen overflow-y-auto">
          <AttendanceMain
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>
    </div>
  );
};

export const SideNavigationContent = () => {
  return (
    <div className="flex flex-col p-5 bg-slate-800 min-h-screen">
      <div className="flex flex-col  h-full">
        {app.navigation.map((navItem) => handleNavigation(navItem))}
      </div>
    </div>
  );
};

const handleNavigation = (navItem: TNavigation, iteration = 1) => {
  if (navItem.type === "link" && navItem.path) {
    return (
      <SideNavigation.NavLink
        key={navItem.key}
        to={navItem.path}
        className={`${iteration > 1 ? "px-0" : ""}`}
      >
        {navItem.icon}
        {navItem.name}
      </SideNavigation.NavLink>
    );
  }

  if (navItem.type === "group" && navItem.submenu) {
    return (
      <SideNavigation.Group key={navItem.key}>
        <SideNavigation.GroupTrigger group={navItem.key}>
          {navItem.icon}
          {navItem.name}
        </SideNavigation.GroupTrigger>
        <SideNavigation.GroupContent group={navItem.key}>
          {navItem.submenu.map((submenuItem) =>
            handleNavigation(submenuItem, iteration + 1)
          )}
        </SideNavigation.GroupContent>
      </SideNavigation.Group>
    );
  }

  return null;
};

export { ScannerLayout };
