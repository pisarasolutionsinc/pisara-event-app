import { useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import CreateEventForm from "../drawer/CreateEventForm";

type EventSearchBarProps = {
  fetchReports: () => Promise<void>;
};

export const EventSearchBar = ({ fetchReports }: EventSearchBarProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative flex items-center border rounded-md bg-white mb-4">
      <span className="px-3">
        <FaSearch className="text-gray-500 " />
      </span>
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        className="flex-1 px-3 py-2 outline-none"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="relative">
        <div className="flex justify-between items-center ">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            <BiPlusCircle className="w-6 h-6 mr-2" />
            Add Event
          </button>

          <CreateEventForm
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={() => setIsDrawerOpen(false)}
            onSave={() => {
              fetchReports();
            }}
          />
        </div>
      </div>
    </div>
  );
};
