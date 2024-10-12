import { BiCalendarEvent } from "react-icons/bi";
import { Tab } from "../../../../components/buttons/Tab";
import { MdDashboard } from "react-icons/md";
import SearchInput from "../../../../components/inputs/SearchInput";
import { useState } from "react";

type TabProps = {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
};

export const HeaderEvent = ({ activeTab, setActiveTab }: TabProps) => {
  const [search, setSearch] = useState("");
  const EventTab = [
    {
      name: "Events",
      tabValue: "list",
      icon: <BiCalendarEvent size={20} />,
      onClick: () => {
        const searchParams = new URLSearchParams();
        searchParams.set("tab", "list");

        setActiveTab("list");
      },
    },
    {
      name: "Reports",
      tabValue: "reports",
      icon: <MdDashboard size={20} />,
      onClick: () => {
        const searchParams = new URLSearchParams();
        searchParams.set("tab", "reports");
        setActiveTab("reports");
      },
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex justify-between items-center">
      <Tab
        tabs={EventTab}
        activeTab={activeTab}
        containerClassName=""
        buttonClassName="border-b-2 border-gray-200"
        activeClassName="text-blue-500 border-b-4 border-blue-500"
        inactiveClassName=" text-black"
      />
      <div>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Type your search..."
          className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
      </div>
    </div>
  );
};
