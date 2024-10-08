import { useEffect, useRef, useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import { usePerson } from "../../hooks/usePerson";
import Drawer from "./../cards/Drawer";
import { Person } from "../../model/personModel";
import { calculateAge } from "../../utils/useMath";
import { formatAddressesToText } from "../../utils/useLocation";
import { Address } from "../../model/collectionModel";
import { debounce } from "../../utils/useDebounce";
import { useToast } from "../../context/ToastProvider";

interface AddAttendeesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getEvent: (id: string) => Promise<any>;
}

const SearchVoter = ({
  isDrawerOpen,
  setIsDrawerOpen,
  getEvent,
}: AddAttendeesDrawerProps) => {
  const { createAttendanceMultipleAttendees, eventId } = useEvent();
  const { searchPerson } = usePerson();
  const { showToast } = useToast();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [search, setSearch] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const debounceSearch = useRef(
    debounce(async (input: string) => {
      const result = await searchPerson("name.firstname", input);
      setSearch(result || []);
      setShowSuggestions(true);
    }, 1000)
  ).current;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setShowSuggestions(false);
      setSearch([]);
    } else {
      debounceSearch(searchInput);
    }
  }, [searchInput, debounceSearch]);

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
    setIsLoading(true);
    try {
      const selectedLeaderIds = selectedPersons.map((leader) => leader._id);
      // console.log("Selected Leader IDs:", selectedLeaderIds);
      const data: any = await createAttendanceMultipleAttendees(
        selectedLeaderIds as string[],
        eventId
      );
      if (data && data.length > 0) {
        console.log("Data:", data);
        showToast("Voters added successfully", "success", "bottom-10 right-10");
        setIsLoading(false);
        setIsDrawerOpen(false);
        getEvent(eventId as string);
      } else {
        showToast(
          "Failed to add attendees because it was existing or invalid request",
          "error",
          "bottom-10 right-10"
        );
        setIsLoading(false);
        setIsDrawerOpen(false);
      }
      setSelectedPersons([]); // Clear selected persons after submission
    } catch (error) {
      console.error("Failed to add attendees:", error);
      setIsLoading(false);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div>
      <Drawer
        isOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        title="Search Voter"
        bgColor="bg-white"
        titleColor="text-black"
      >
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
                    {formatAddressesToText(suggestion.address as Address[])} )
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
            className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white text-xs md:text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Please Wait...
              </>
            ) : (
              " Add Attendees"
            )}
          </button>
        </form>
      </Drawer>
    </div>
  );
};

export default SearchVoter;
