import Drawer from "../../../../components/cards/Drawer";
import { useEffect, useRef, useState } from "react";
import { useEvent } from "../../../../hooks/useEvent";
import { Person } from "../../../../model/personModel";
import debounce from "lodash/debounce";
import { calculateAge } from "../../../../utils/useMath";
import { formatAddressesToText } from "./../../../../utils/useLocation";
import { Address } from "../../../../model/collectionModel";
import UploadCard from "../../../../components/cards/UploadCard";
import { useConverter } from "../../../../hooks/useConverter";
import { AiOutlineClose } from "react-icons/ai";
import CodeEditorModal from "../../../../components/modals/CodeEditorModal/CodeEditorModal";
import { usePerson } from "../../../../hooks/usePerson";

interface AddAttendeesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddAttendeesDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: AddAttendeesDrawerProps) => {
  const { createAttendanceMultipleAttendees } = useEvent();
  const { searchPerson, search } = usePerson();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("search");
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    handleFileUpload,
    uploadedFiles,
    handleGetData,
    handleDeleteFile,
    modalOpen,
    modalData,
    setModalOpen,
  } = useConverter();

  useEffect(() => {
    if (searchInput.trim() === "") {
      setShowSuggestions(false);
    } else {
      debounceSearch();
    }
  }, [searchInput]);

  const debounceSearch = debounce(() => {
    searchPerson("name.firstname", searchInput);
    setShowSuggestions(true);
  }, 300);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: Person) => {
    if (!selectedPersons.some((leader) => leader._id === suggestion._id)) {
      setSelectedPersons([...selectedPersons, suggestion]);
    }
    setSearchInput("");
    setShowSuggestions(false);
  };

  const handleRemoveLeader = (id: string) => {
    setSelectedPersons(selectedPersons.filter((leader) => leader._id !== id));
  };

  const handleInputClick = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedLeaderIds = selectedPersons.map((leader) => leader._id);
      await createAttendanceMultipleAttendees(selectedLeaderIds as string[]);
    } catch (error) {
      console.error("Failed to add attendees:", error);
    }
  };

  return (
    <div>
      <Drawer
        isOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        title="Add Attendees"
        bgColor="bg-white"
        titleColor="text-black"
      >
        {/* Tabs */}
        <div className="flex border-b ">
          <button
            className={`px-4 py-2 ${
              activeTab === "search"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "import"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("import")}
          >
            Import
          </button>
          {/* You can add more tabs here as needed */}
        </div>

        {/* Tab Content */}
        {activeTab === "search" && (
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mt-4 relative">
              <label className="block text-xs font-medium text-gray-700">
                Attendees
              </label>
              <div
                className="mt-1 w-full border-gray-500 border text-sm rounded-md shadow-sm px-4 py-2 flex items-center cursor-text focus-within:border-blue-500"
                onClick={handleInputClick}
              >
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent focus:outline-none focus:ring-0"
                  placeholder="Enter person names"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  ref={inputRef}
                />
              </div>
              {showSuggestions && search.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {search.map((suggestion: Person) => (
                    <li
                      key={suggestion._id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.name.firstname} {suggestion.name.lastname} (
                      {calculateAge(suggestion.birthday as any)},{" "}
                      {formatAddressesToText(suggestion.address as Address[])})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* List of selected attendees */}
            {selectedPersons.length > 0 && (
              <div className="mt-4">
                <ul className="border-t border-gray-300 pt-2">
                  {selectedPersons.map((leader) => (
                    <li
                      key={leader._id}
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-sm text-gray-700">
                        {leader.name.lastname} {leader.name.firstname}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveLeader(leader._id as string)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Attendees
            </button>
          </form>
        )}
        {activeTab === "import" && (
          <div className="p-4">
            <UploadCard variant="default" onFileUpload={handleFileUpload} />
            <div className="mt-4">
              <h2 className="text-sm font-bold mb-2">Uploaded Files:</h2>
              <div className="">
                {uploadedFiles.map((file, index) => (
                  <div
                    className="mb-2 shadow-md p-4 justify-between flex items-center rounded-lg bg-white"
                    key={index}
                  >
                    <p>{file.name}</p>
                    <div className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleGetData(file)}
                      >
                        GET DATA
                      </button>
                      <button
                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDeleteFile(index)}
                      >
                        <AiOutlineClose className="mx-auto my-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
      <CodeEditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
    </div>
  );
};

export default AddAttendeesDrawer;
