import { useState } from "react";
import { ReactNode } from "react";
import { SideNavigation } from "../components/navigation/SideNavigation";
import { Outlet } from "react-router-dom";
import { navigation } from "./../config/app";
import { Sling as Hamburger } from "hamburger-react";

type TNavigation = {
  key: string;
  name: string;
  path?: string;
  type: string;
  submenu?: TNavigation[];
  icon: ReactNode;
};

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-slate-900 text-white border-r border-slate-800 w-64 sm:w-72  md:relative md:translate-x-0   xl:w-52`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
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
          isSidebarOpen ? " sm:ml-72 lg:ml-80" : "ml-0"
        }`}
      >
        <div className="flex justify-between items-center p-5 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-blue-500 text-white rounded"
          >
            {/* Hamburger Button */}
            <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} />
          </button>
          <h1 className="text-xl font-bold">App Title</h1>
        </div>
        <div className="flex flex-col bg-[#fcfcfc] min-h-screen overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const SideNavigationContent = () => {
  return (
    <div className="flex flex-col p-5 bg-slate-800 min-h-screen">
      <div className="flex flex-col items-center h-full">
        {navigation.main.map((navItem) => handleNavigation(navItem))}
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

export { MainLayout };
