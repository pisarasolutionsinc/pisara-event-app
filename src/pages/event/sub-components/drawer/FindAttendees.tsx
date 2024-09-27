import Drawer from "../../../../components/cards/Drawer";

import { useEffect, useRef, useState } from "react";
import { useEvent } from "../../../../hooks/useEvent";
import { Person } from "../../../../model/personModel";
import debounce from "lodash/debounce"; // Add lodash debounce
import { usePerson } from "../../../../hooks/usePerson";

interface FindAttendeesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindAttendeesDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: FindAttendeesDrawerProps) => {
  const { createAttendanceMultipleAttendees } = useEvent();
  const { searchPerson, search } = usePerson();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setShowSuggestions(false); // Hide suggestions if input is empty
    } else {
      debounceSearch(); // Trigger debounced search
    }
  }, [searchInput]);

  // Debounce search to avoid excessive API calls
  const debounceSearch = debounce(() => {
    searchPerson("name.firstname", searchInput); // Adjust field based on schema
    setShowSuggestions(true); // Show suggestions
  }, 300);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleSuggestionClick = (suggestion: Person) => {
    if (!selectedPersons.some((leader) => leader._id === suggestion._id)) {
      setSelectedPersons([...selectedPersons, suggestion]);
    }
    setSearchInput(""); // Clear input field
    setShowSuggestions(false); // Hide suggestions
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
      // Extract the _id values of the selected leaders
      const selectedLeaderIds = selectedPersons.map((leader) => {
        if (!leader._id) {
          throw new Error("Invalid leader data: missing _id");
        }
        return leader._id;
      });

      // console.log("Selected Leader IDs:", selectedLeaderIds); // Debugging log

      await createAttendanceMultipleAttendees(selectedLeaderIds as string[]);
    } catch (error) {
      console.error("Failed to add attendees:", error);
      // Handle error gracefully, e.g., show error to the user
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
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mt-4 relative">
            <label className="block text-xs font-medium text-gray-700">
              Attendees
            </label>
            <div
              className="mt-1 w-full border-gray-500 border text-sm rounded-md shadow-sm px-4 py-2 flex flex-wrap items-center cursor-text focus-within:border-blue-500"
              onClick={handleInputClick}
            >
              {selectedPersons.map((leader) => (
                <span
                  key={leader._id}
                  className="inline-flex items-center m-1 bg-gray-100 rounded-full text-blue-500 text-xs font-medium mx-1 px-2 py-1"
                >
                  {leader.name.lastname} {leader.name.firstname}
                  <button
                    type="button"
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent input field click event
                      handleRemoveLeader(leader._id as string);
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
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
                    {suggestion.name.lastname} {suggestion.name.firstname}
                  </li>
                ))}
              </ul>
            )}
          </div>

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

export default FindAttendeesDrawer;
