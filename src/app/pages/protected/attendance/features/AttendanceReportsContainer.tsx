import { IoIosArrowForward } from "react-icons/io";
import { Header, RowData } from "../../../../models/tableModel";

type AttendanceReportsContainerProps = {
  rows?: RowData[];
  headers?: Header[];
  onClose?: () => void;
};

export const AttendanceReportsContainer = ({
  rows = [],
  headers = [],
  onClose = () => {},
}: AttendanceReportsContainerProps) => {
  // Create a mapping of status labels and colors based on the headers
  const statusMapping: Record<string, { label: string; color: string }> = {};
  const statusHeader = headers.find((header) => header.type === "status");

  if (statusHeader && statusHeader.option) {
    statusHeader.option.forEach((option) => {
      statusMapping[option.value] = {
        label: option.label,
        color: option.color,
      }; // Map the value to the corresponding label and color
    });
  }

  // Count the status occurrences
  const statusCounts: Record<string, number> = {};

  rows.forEach((row) => {
    row.status.forEach((status: string) => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  });

  // Create an array of status cards using the mapped labels and colors
  const statusCards = Object.entries(statusCounts).map(([status, count]) => {
    const { label, color } = statusMapping[status] || {
      label: status,
      color: "#000",
    }; // Fallback to default if not found
    return (
      <div
        key={status}
        className="bg-gray-50 border border-gray-300 rounded p-4 text-center w-full shadow-md"
      >
        <h3 className="text-lg font-bold" style={{ color: color }}>
          {label}
        </h3>
        <p className="text-2xl text-gray-500 font-semibold">{count}</p>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onClose}>
            <IoIosArrowForward size={20} className="text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-gray-400">
            Attendance Reports
          </h1>
        </div>

        <button className="border rounded-full text-gray-700 text-xs px-4 py-1 hover:bg-gray-200 ">
          View More
        </button>
      </div>

      {statusCards.length > 0 ? (
        statusCards
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};
