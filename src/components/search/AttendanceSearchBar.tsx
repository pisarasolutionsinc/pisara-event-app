import { useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import VoterDrawer from "../drawer/VoterDrawer";
import AddVotersByFileDrawer from "../drawer/AddVotersByFile";
import AddVotersByLocationDrawer from "../drawer/AddVotersByLocation";
import SearchVoter from "../drawer/searchVoter";
import CodeEditorModal from "../modals/CodeEditorModal/CodeEditorModal";
import { useConverter } from "../../hooks/useConverter";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";

interface Props {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  event?: any;
  getEvent?: (id: string) => Promise<any>;
  person?: any;
}

type DrawerType =
  | "none"
  | "addVoters"
  | "findVoters"
  | "addVotersByFile"
  | "addVotersByLocation";

export default function AttendanceSearchBar({
  searchInput,
  setSearchInput,
  event,
  getEvent,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>("none");
  const { modalOpen, modalData, setModalOpen } = useConverter();
  const { eventId } = useEvent();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openDrawer = (drawerType: DrawerType) => {
    setActiveDrawer(drawerType);
    setIsDropdownOpen(false); // Close dropdown when opening a drawer
  };

  return (
    <div className="relative flex items-center border rounded-md bg-white ">
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        className="flex-1 mx-3 py-2 outline-none"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-3 py-4 sm:py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
        >
          <MdManageAccounts size={20} className="mr-2" />
          <span className="hidden sm:block">Manage Attendees</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20">
            <ul className="py-1 text-gray-700 w-full">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => openDrawer("addVotersByLocation")}
                >
                  Add Attendees from Location
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => openDrawer("addVotersByFile")}
                >
                  Add Attendees from File
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => openDrawer("addVoters")}
                >
                  Create New Attendees
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => openDrawer("findVoters")}
                >
                  Search Attendees
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate(`/event/${eventId}/register?access=private`);
                  }}
                >
                  Invite Attendees
                </button>
              </li>
            </ul>
          </div>
        )}

        <SearchVoter
          isDrawerOpen={activeDrawer === "findVoters"}
          setIsDrawerOpen={() => setActiveDrawer("none")}
          getEvent={getEvent as any}
        />
        <VoterDrawer
          isDrawerOpen={activeDrawer === "addVoters"}
          setIsDrawerOpen={() => setActiveDrawer("none")}
          page="attendance"
          data={event}
          getEvent={getEvent as any}
        />
        <AddVotersByFileDrawer
          isDrawerOpen={activeDrawer === "addVotersByFile"}
          setIsDrawerOpen={() => setActiveDrawer("none")}
          event={event}
          getEvent={getEvent as any}
        />
        <AddVotersByLocationDrawer
          isDrawerOpen={activeDrawer === "addVotersByLocation"}
          setIsDrawerOpen={() => setActiveDrawer("none")}
          getEvent={getEvent as any}
        />
        <CodeEditorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data={modalData}
        />
      </div>
    </div>
  );
}
