import { useState, useEffect } from "react";
import { BiPlusCircle } from "react-icons/bi";

import CreateEventForm from "../drawer/CreateEventForm";
import { debounce } from "../../utils/useDebounce";

type EventSearchBarProps = {
  fetchReports: () => Promise<void>;
  fetchEvents: (
    query?: { field?: string; value?: any },
    selectFields?: string[],
    populateFields?: string[],
    limit?: number,
    page?: number,
    sort?: string
  ) => Promise<void>;
};

export const EventSearchBar = ({
  fetchReports,
  fetchEvents,
}: EventSearchBarProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Debounced search function to avoid multiple calls while typing
  const debouncedSearch = debounce((value: string) => {
    fetchEvents({ field: "name", value }); // Use the name or any other field for searching
  }, 300);

  // UseEffect to trigger search every time searchInput changes
  useEffect(() => {
    if (searchInput.trim() !== "") {
      debouncedSearch(searchInput);
    } else {
      fetchEvents(); // Fetch all events if search input is cleared
    }

    return () => {
      debouncedSearch.cancel(); // Cleanup the debounced function
    };
  }, [searchInput]);

  return (
    <div className="relative flex items-center border rounded-md bg-white mb-4">
      <input
        type="text"
        placeholder="Search events..."
        value={searchInput}
        className="flex-1 mx-3  py-2 outline-none"
        onChange={(e) => setSearchInput(e.target.value)} // Update search input state
      />
      <div className="relative">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            <BiPlusCircle className="w-6 h-6 mr-2" />
            Add Event
          </button>

          <CreateEventForm
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen} // Directly pass the state setter
            onSave={async () => {
              await fetchReports(); // Ensure the reports are fetched
              await fetchEvents(); // Fetch events after reports
              setIsDrawerOpen(false); // Close the drawer after saving
            }}
          />
        </div>
      </div>
    </div>
  );
};
