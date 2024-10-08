import { useState } from "react";
import { BsBox } from "react-icons/bs";
import { useEvent } from "../../hooks/useEvent";

export default function AppDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { eventId } = useEvent();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      <button
        className="gap-2 w-full bg-gray-100 rounded-lg p-2 flex justify-center items-center"
        onClick={toggleDropdown}
      >
        <BsBox />
        Apps
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-20">
          <ul className="flex flex-col">
            <li>
              <button
                onClick={() => {
                  toggleDropdown();

                  window.open(`/event/${eventId}/welcome`);
                }}
                className="block px-4 py-2 hover:bg-gray-200 rounded-lg"
              >
                Welcome
              </button>
            </li>
            {/* <li>
              <Link
                to={`/event/${eventId}/${
                  getLocal("auth").user.template.certificateTemp
                }/certificate`}
                className="block px-4 py-2 hover:bg-gray-200 rounded-lg"
              >
                Certificate
              </Link>
            </li> */}
          </ul>
        </div>
      )}
    </div>
  );
}
