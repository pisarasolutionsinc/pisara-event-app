import { useState, useEffect, useRef } from "react";

interface FilterButtonProps {
    title: string;
    applyFilter: (value: string) => void;
    defaultValue: string;
    options: string[];
}

function FilterButton({ title, applyFilter, defaultValue, options }: FilterButtonProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (selectedValue: string) => {
        setSelectedOption(selectedValue);
        applyFilter(selectedValue);
        setDropdownOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
      }
  };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`flex flex-row items-center text-gray-500 text-md px-4 py-2 rounded-md border border-gray-300 ${selectedOption !== "All" ? "bg-white" : ""}`}
            >
                <p>{title}: <span className="font-semibold text-blue-600">{selectedOption}</span></p>
            </button>
            {dropdownOpen && (
                <div className="absolute w-48 bg-white rounded-b-md z-10 border-x border-b border-gray">
                    <div className="py-1">
                        {options.map((value: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(value)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterButton;
