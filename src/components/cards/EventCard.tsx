import { Event } from "../../model/eventsModel";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiShield } from "react-icons/bi";
import Tooltip from "../tooltip/Tooltip";
import { Link } from "react-router-dom";
import { Person } from "../../model/personModel";
import { EventStatusEnum } from "../../config/modelConfig";
import { useState, useRef, useEffect } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

// Function to generate a random color
const getConsistentColor = (id: string): string => {
  const colors = [
    "#FFB6C1",
    "#FF6347",
    "#FFD700",
    "#90EE90",
    "#ADD8E6",
    "#FF69B4",
    "#D3D3D3",
    "#E6E6FA",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Function to get initials from a string
const getInitials = (name: string): string => {
  if (!name || typeof name !== "string") return ""; // Check if name is undefined or not a string

  const words = name.split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase() || ""; // Use optional chaining to safely access the first letter
  return (
    (words[0][0]?.toUpperCase() || "") + (words[1][0]?.toUpperCase() || "")
  ); // Safely get initials
};

interface EventCardProps {
  event: Event;
  handleDeleteEvent: (id: string) => void;
  handleCloneEvent: (data: any) => void;
}

const EventCard = ({
  event,
  handleDeleteEvent,
  handleCloneEvent,
}: EventCardProps) => {
  const totalExpenses = event.totalExpenses || 0;
  const numberOfAttendees = event.totalAttendees || 0;
  const eventInitials = getInitials(event.name || "");
  const fallbackColor = getConsistentColor(event._id ?? ""); // Use the consistent color function
  const maxDisplayedLeaders = 4;
  const leaders: Person[] = event.leaders || [];
  const displayedLeaders = leaders.slice(0, maxDisplayedLeaders);
  const moreLeaders = leaders.slice(maxDisplayedLeaders);
  const [isImageBroken, setIsImageBroken] = useState<boolean>(false);
  const [isLeaderImageBroken, setIsLeaderImageBroken] =
    useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClone = () => {
    console.log("Clone action triggered for event:", event._id);
    const clonedEvent = {
      ...event,
      _id: undefined,
      name: `[Clone] ${event.name}`,
      totalExpenses: 0,
      status: EventStatusEnum.PENDING,
    };
    console.log("Cloned event:", clonedEvent);
    handleCloneEvent(clonedEvent);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete action triggered for event:", event._id);
    handleDeleteEvent(event._id || "");
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-lg overflow-hidden relative">
      {event.coverPhoto ? (
        <div className="w-full h-48 relative">
          {!isImageBroken ? (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-gray-800 to-transparent opacity-75"></div>
              <img
                src={event.coverPhoto}
                alt={event.name}
                className="w-full h-48 object-cover"
                onError={() => setIsImageBroken(true)}
              />
            </>
          ) : (
            <div
              className="w-full h-48 flex items-center justify-center text-white text-3xl font-bold relative"
              style={{ backgroundColor: fallbackColor }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-gray-800 to-transparent opacity-75"></div>
              {eventInitials}
            </div>
          )}
          <HiEllipsisHorizontal
            className="absolute top-4 right-4 text-lg text-white cursor-pointer"
            onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-10 right-4 bg-white border rounded shadow-lg z-10"
            >
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleClone}
              >
                Clone
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
          <Link
            to={`/event/${event._id}`}
            className="absolute top-10 left-0 w-full h-36  "
          ></Link>
        </div>
      ) : (
        <div
          className="w-full h-48 flex items-center justify-center text-white text-3xl font-bold relative"
          style={{ backgroundColor: fallbackColor }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-gray-800 to-transparent opacity-75"></div>
          {eventInitials}
          <HiEllipsisHorizontal
            className="absolute top-4 right-4 text-lg text-white cursor-pointer "
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the Link
              toggleDropdown();
            }}
          />

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-10 right-4 bg-white border rounded shadow-lg z-10"
            >
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleClone}
              >
                Clone
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}

          <Link
            to={`/event/${event._id}`}
            className="absolute top-10 left-0 w-full h-36  "
          ></Link>
        </div>
      )}

      <Link to={`/event/${event._id}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Tooltip text={event.name || "No event name"}>
              <h2 className="text-sm font-bold  text-black/70 text-nowrap truncate w-full">
                {event.name || "No event name"}
              </h2>
            </Tooltip>
            <p className="text-gray-700 ">
              <span
                className={` py-1 uppercase text-xs ${
                  event.status?.toLowerCase() === EventStatusEnum.ACTIVE
                    ? "text-green-500 border-green-500"
                    : event.status?.toLowerCase() === EventStatusEnum.PENDING
                    ? "text-gray-500 border-gray-500"
                    : event.status?.toLowerCase() === EventStatusEnum.DONE
                    ? "text-blue-500 border-blue-500"
                    : event.status?.toLowerCase() === EventStatusEnum.CANCELLED
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-gray-500"
                }`}
              >
                {event.status?.toLowerCase() === EventStatusEnum.PENDING
                  ? "SCHEDULED"
                  : event.status || "Unknown"}
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-700 flex items-center">
              <Tooltip text={`Attendees`}>
                <FaPeopleGroup size={23} className="mr-2" />
              </Tooltip>{" "}
              {numberOfAttendees}
            </p>
            <div className="flex items-center">
              <Tooltip text={"Total Expenses"}>
                <p className="text-gray-700 flex items-center ">
                  <span className="font-semibold ">₱</span>
                  <span className="ml-1 font-normal">
                    {totalExpenses || "0"}
                  </span>
                </p>
              </Tooltip>
            </div>
          </div>

          <div className="text-gray-700 mb-2 flex items-center">
            <Tooltip text="Leaders">
              <BiShield size={23} className="mr-2" />
            </Tooltip>

            {displayedLeaders.length > 0 ? (
              displayedLeaders.map((leader) => {
                if (!leader || !leader.name) return null;

                const profilePicture = leader.photo || null;
                const initials = getInitials(
                  `${leader.name.firstname || ""} ${leader.name.lastname || ""}`
                );

                return (
                  <Tooltip
                    key={leader._id}
                    text={`${leader.name.firstname || ""} ${
                      leader.name.lastname || ""
                    }`}
                  >
                    <span className="flex items-center mr-2">
                      {profilePicture && !isLeaderImageBroken ? (
                        <img
                          src={profilePicture}
                          alt={`${leader.name.firstname || ""} ${
                            leader.name.lastname || ""
                          }`}
                          className="w-8 h-8 rounded-full object-cover cursor-pointer"
                          onError={() => setIsLeaderImageBroken(true)}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                          <span className="text-gray-700 font-semibold">
                            {initials}
                          </span>
                        </div>
                      )}
                    </span>
                  </Tooltip>
                );
              })
            ) : (
              <span className="text-gray-500">No leaders</span>
            )}

            {moreLeaders.length > 0 && (
              <Tooltip text={`${moreLeaders.length} more leaders`}>
                <span className="text-gray-500">{`+${moreLeaders.length}`}</span>
              </Tooltip>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
