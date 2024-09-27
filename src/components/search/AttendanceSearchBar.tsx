import { useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import VoterDrawer from "../drawer/VoterDrawer";
import AddVotersByFileDrawer from "../drawer/AddVotersByFile";
import AddVotersByLocationDrawer from "../drawer/AddVotersByLocation";
import SearchVoter from "../drawer/searchVoter";
import CodeEditorModal from "../modals/CodeEditorModal/CodeEditorModal";
import { useConverter } from "../../hooks/useConverter";

interface Props {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  event: any;
  getEvent?: (id: string) => Promise<any>;
  person?: any;
}

export default function AttendanceSearchBar({
  searchInput,
  setSearchInput,
  event,
  getEvent,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerAddVotersOpen, setIsDrawerAddVotersOpen] = useState(false);
  const [isDrawerFindVotersOpen, setIsDrawerFindVotersOpen] = useState(false);
  const [isDrawerAddVotersByFileOpen, setIsDrawerAddVotersByFileOpen] =
    useState(false);
  const [isDrawerAddVotersByLocationOpen, setIsDrawerAddVotersByLocationOpen] =
    useState(false);
  const { modalOpen, modalData, setModalOpen } = useConverter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative flex items-center border rounded-md bg-white mb-4">
      {/* <span className="px-3">
        <FaSearch className="text-gray-500 " />
      </span> */}
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        className="flex-1 mx-3  py-2 outline-none"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-3 py-4 sm:py-2  text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
        >
          <MdManageAccounts size={20} className="mr-2" />{" "}
          <span className="hidden sm:block">Manage Attendees</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20">
            <ul className="py-1 text-gray-700 w-full">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsDrawerAddVotersByLocationOpen(true);
                    // Trigger Create New Attendees action here
                  }}
                >
                  Add Voters from Location
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsDrawerAddVotersByFileOpen(true);
                    // Trigger Create New Attendees action here
                  }}
                >
                  Add Voters from File
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsDrawerAddVotersOpen(true);
                    // Trigger Create New Attendees action here
                  }}
                >
                  Create Voter
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsDrawerFindVotersOpen(true);
                    // Trigger Create New Attendees action here
                  }}
                >
                  Search Voter
                </button>
              </li>
            </ul>
          </div>
        )}
        {/* <AddAttendeesDrawer
          isDrawerOpen={isDrawerAddAttendeesOpen}
          setIsDrawerOpen={setIsDrawerAddAttendeesOpen}
        /> */}
        <SearchVoter
          isDrawerOpen={isDrawerFindVotersOpen}
          setIsDrawerOpen={setIsDrawerFindVotersOpen}
        />
        <VoterDrawer
          isDrawerOpen={isDrawerAddVotersOpen}
          setIsDrawerOpen={setIsDrawerAddVotersOpen}
          openFrom="attendance"
          data={event}
          getEvent={getEvent as any}
        />
        <AddVotersByFileDrawer
          isDrawerOpen={isDrawerAddVotersByFileOpen}
          setIsDrawerOpen={setIsDrawerAddVotersByFileOpen}
          event={event}
          getEvent={getEvent as any}
        />
        <AddVotersByLocationDrawer
          isDrawerOpen={isDrawerAddVotersByLocationOpen}
          setIsDrawerOpen={setIsDrawerAddVotersByLocationOpen}
          event={event}
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
