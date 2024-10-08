import { useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import AttendancePage from "./Attendance";
import AttendanceSidebar from "./sub-components/table/event/AttendanceSidebar";
import { useHookOnce } from "../../utils/useHook";

type AttendanceMainProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const AttendanceMain = ({
  isSidebarOpen,
  toggleSidebar,
}: AttendanceMainProps) => {
  const { eventId, getEvent } = useEvent();
  const [activeTab, setActiveTab] = useState<"scanner" | "attendance">(
    "scanner"
  );
  const [event, setEvent] = useState<any>(null);
  const selectedFields = [
    "_id",
    "name",
    "description",
    "date",
    "location",
    "coverPhoto",
    "photos",
    "leaders",
    "category",
    "link",
    "expenses",
    "status",
    "startTime",
    "endTime",
    "createdAt",
    "updatedAt",
    "organizer",
    "template.certificate",
  ];
  const populateFields = ["leaders", "attendees", "attendees.voter.scannedBy"];

  useHookOnce(() => {
    fetchEvent();
  });

  // Tab change handler
  const handleTabChange = (tab: "scanner" | "attendance") => {
    setActiveTab(tab);
  };

  const fetchEvent = async () => {
    try {
      const result = await getEvent(
        eventId as string,
        selectedFields,
        populateFields
      );
      setEvent(result);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  return (
    <div className="lg:flex h-screen w-full">
      {/* For smaller screens, show tabs */}
      <div className="lg:hidden flex justify-around border-b bg-white">
        <button
          className={`p-2 ${
            activeTab === "scanner" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleTabChange("scanner")}
        >
          Scanner
        </button>
        <button
          className={`p-2 ${
            activeTab === "attendance" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleTabChange("attendance")}
        >
          Attendance
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-grow block lg:hidden">
        {activeTab === "scanner" && (
          <AttendanceSidebar
            toggled={isSidebarOpen}
            toggle={toggleSidebar}
            event={event}
          />
        )}

        {activeTab === "attendance" && (
          <AttendancePage event={event} getEvent={fetchEvent} />
        )}
      </div>

      <div className="hidden lg:flex w-full ">
        <AttendanceSidebar
          toggled={isSidebarOpen}
          toggle={toggleSidebar}
          event={event}
          getEvent={fetchEvent}
        />
        <AttendancePage event={event} getEvent={fetchEvent} />
      </div>
    </div>
  );
};
