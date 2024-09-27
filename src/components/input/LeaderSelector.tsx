import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface LeaderSelectorProps {
  selectedLeaders: any[];
  leaderInput: string;
  search: any[];
  showSuggestions: boolean;
  handleLeaderInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputClick: () => void;
  handleRemoveLeader: (id: string) => void;
  handleSuggestionClick: (suggestion: any) => void;
}

const LeaderSelector: React.FC<LeaderSelectorProps> = ({
  selectedLeaders,
  leaderInput,
  search,
  showSuggestions,
  handleLeaderInputChange,
  handleInputClick,
  handleRemoveLeader,
  handleSuggestionClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedLeaders.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedLeaders]);

  return (
    <div className="relative mt-3">
      <div
        className="w-full border rounded-md px-4 py-2 flex flex-wrap items-center cursor-text focus-within:border-blue-600 transition-colors duration-200 ease-in-out"
        onClick={handleInputClick}
      >
        {selectedLeaders.map((leader) => (
          <span
            key={leader._id}
            className="inline-flex items-center bg-gray-200 rounded-full text-blue-600 text-xs font-medium mx-1 px-2 py-1"
          >
            {leader.name.lastname} {leader.name.firstname}
            <button
              type="button"
              className="ml-2 text-xs text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveLeader(leader._id);
              }}
            >
              &times;
            </button>
          </span>
        ))}

        <input
          type="text"
          id="leader-input"
          className={twMerge(
            "flex-1 border-none bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 peer"
          )}
          placeholder=" " // Placeholder to maintain the layout
          value={leaderInput}
          onChange={handleLeaderInputChange}
          onFocus={() => setIsFocused(true)} // Set focus state
          onBlur={() => setIsFocused(false)} // Reset focus state
          ref={inputRef}
        />
        <label
          htmlFor="leader-input"
          className={twMerge(
            `absolute  cursor-pointer bg-white text-gray-500 transition-transform duration-200 ease-in-out transform ${
              leaderInput || selectedLeaders.length > 0 || isFocused
                ? "-top-3 scale-75 text-blue-600 -left-1"
                : "top-2 scale-100 left-2"
            }`
          )}
        >
          Leader/s (optional)
        </label>
      </div>

      {showSuggestions && search.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {search.map((suggestion: any) => (
            <li
              key={suggestion._id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors duration-150"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name.lastname} {suggestion.name.firstname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaderSelector;
