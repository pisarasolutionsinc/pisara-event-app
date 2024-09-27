import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../../components/cards/EventCard";
import { BiCalendarEvent } from "react-icons/bi";
import { useEvent } from "../../hooks/useEvent";
import { StatCard } from "../../components/cards/StatCard";
import { BsCashCoin } from "react-icons/bs";
import { FaPerson } from "react-icons/fa6";
import { EventSearchBar } from "../../components/search/EventSearchBar";
import { useHookOnce } from "../../utils/useHook";

const EventPage = () => {
  const { report, fetchReports, searchEvents } = useEvent(); // Use React Router's useSearchParams to get the tab query parameter
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const totalEvent = report?.event?.totalEvent ?? 0;
  const totalAttendance = report?.event?.totalAttendance ?? 0;
  const totalExpenses = report?.event?.totalExpenses ?? 0;

  const [events, setEvents] = useState<any[] | []>([]);
  const selectedFields = [
    "_id",
    "name",
    "leaders",
    "expenses",
    "coverPhoto",
    "attendees",
    "status",
    "totalExpenses",
    "totalAttendees",
  ];
  const populateFields = ["leaders"];

  // Read tab parameter from URL or default to 'events'
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "report" ? "dashboard" : "events"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalEvent / itemsPerPage);
  const pageRange = 5;

  useHookOnce(() => {
    fetchEvents();
  });

  useHookOnce(() => {
    fetchReports();
  });

  const fetchEvents = async (
    query: { field?: string; value?: any } = {},
    selectFields: string[] = [
      "_id",
      "name",
      "leaders",
      "expenses",
      "coverPhoto",
      "attendees",
      "status",
      "totalExpenses",
      "totalAttendees",
    ],
    populateFields: string[] = ["leaders"],
    limit: number = 8,
    page: number = 1,
    sort: string = "-createdAt"
  ) => {
    setLoading(true);
    try {
      const result: any = await searchEvents(
        query,
        selectFields,
        populateFields,
        limit,
        page,
        sort
      );

      console.log(result);

      if (Array.isArray(result)) {
        setEvents(result as any[]);
        setLoading(false);
      } else {
        console.error(
          "Unexpected response format: Expected an array but received:",
          events
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Update URL when the tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab === "dashboard" ? "report" : "list" });
  }, [activeTab, setSearchParams]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchEvents({}, selectedFields, populateFields, itemsPerPage, page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    if (startPage > 1)
      pages.push(<PaginationButton key="first" page={1} label="1" />);
    if (startPage > 2)
      pages.push(<PaginationButton key="ellipsis1" disabled label="..." />);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          page={i}
          label={i.toString()}
          isActive={currentPage === i}
          onClick={() => handlePageChange(i)}
        />
      );
    }

    if (endPage < totalPages - 1)
      pages.push(<PaginationButton key="ellipsis2" disabled label="..." />);
    if (endPage < totalPages)
      pages.push(
        <PaginationButton
          key="last"
          page={totalPages}
          label={totalPages.toString()}
        />
      );

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <PaginationButton
          label="First"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        />
        <PaginationButton
          label="&lt;"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {pages}
        <PaginationButton
          label="&gt;"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
        <PaginationButton
          label="Last"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("events")}
            className={`relative p-2 px-4 rounded-lg font-semibold focus:outline-none transition duration-300 ${
              activeTab === "events"
                ? " text-gray-600 shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            Events
            {activeTab === "events" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`relative p-2 px-4 rounded-lg font-semibold focus:outline-none transition duration-300 ${
              activeTab === "dashboard"
                ? " text-gray-600 shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            Dashboard
            {activeTab === "dashboard" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>
        <div>
          {activeTab === "events" ? (
            <div>
              <EventSearchBar fetchReports={fetchReports} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Conditionally Render Content Based on Active Tab */}
      {activeTab === "events" ? (
        <>
          {/* Events Content */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array(8)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="animate-pulse p-4 bg-gray-200 rounded-lg h-64 shadow-md"
                    ></div>
                  ))
              : events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
          </div>

          {/* Render Pagination */}
          {totalPages > 1 && renderPagination()}
        </>
      ) : (
        <>
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="TOTAL EVENTS"
              value={totalEvent}
              variant="design2"
              icon={<BiCalendarEvent />}
              classIcon="text-green-300 bg-green-100"
              classParent="shadow-sm border"
            />
            <StatCard
              title="TOTAL ATTENDEES"
              value={totalAttendance}
              variant="design2"
              icon={<FaPerson />}
              classIcon="text-purple-300 bg-purple-100"
              classParent="shadow-sm border"
            />
            <StatCard
              title="TOTAL CASHOUTS"
              value={totalExpenses}
              variant="design2"
              icon={<BsCashCoin />}
              classIcon="text-amber-300 bg-amber-100"
              classParent="shadow-sm border"
              classTitle="text-xs"
            />
          </div>
        </>
      )}
    </div>
  );
};

// Reusable Pagination Button Component
const PaginationButton = ({
  label,
  disabled = false,
  isActive = false,
  onClick = () => {},
}: {
  page?: number;
  label: string;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-md text-sm ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {label}
    </button>
  );
};

export default EventPage;
