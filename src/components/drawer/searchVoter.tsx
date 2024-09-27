import { useEffect, useRef, useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import { usePerson } from "../../hooks/usePerson";
import Drawer from "./../cards/Drawer";
import { debounce } from "lodash";
import { Person } from "../../model/personModel";
import { calculateAge } from "../../utils/useMath";
import { formatAddressesToText } from "../../utils/useLocation";
import { Address } from "../../model/collectionModel";

interface AddAttendeesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchVoter = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: AddAttendeesDrawerProps) => {
  const { createAttendanceMultipleAttendees } = useEvent();
  const { searchPerson, search } = usePerson();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

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
  }, 1000);

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
      </Drawer>
    </div>
  );
};

export default SearchVoter;
