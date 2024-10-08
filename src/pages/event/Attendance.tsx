import { useState } from "react";
import { FaCheck, FaTimes, FaCalendarDay } from "react-icons/fa";
import { formatTimeByDate } from "../../utils/useDateAndTime";
import { StatCard } from "../../components/cards/StatCard";
import Table from "./sub-components/table/attendance/Table";
import TableRow from "./sub-components/table/attendance/TableRow";

import AttendanceSearchBar from "../../components/search/AttendanceSearchBar";
import { BsPerson } from "react-icons/bs";
import AppDropdown from "./../../components/buttons/AppDropDownButton";
import { FaFileExcel } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { capitalizeFullName } from "../../utils/useFormatter";

type AttendanceProps = {
  event: any;
  getEvent?: (id: string) => Promise<any>;
};

const AttendancePage = ({ event, getEvent }: AttendanceProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const votersAttendance =
    event && event?.attendees && event?.attendees.length > 0
      ? event?.attendees
      : [];

  const countStatus = (status: string) => {
    return votersAttendance.filter((record: any) => record.status === status)
      .length;
  };

  const toggleExpandedRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleExportToExcel = () => {
    // Map the data to a format suitable for Excel
    const attendanceData =
      votersAttendance &&
      votersAttendance.map((attendee: any) => ({
        Name: capitalizeFullName(
          attendee.voter?.name?.firstname || "",
          attendee.voter?.name?.lastname || ""
        ),
        Expenses: attendee.expenses || 0,
        Status: attendee.status || "N/A",
        TimeIn: formatTimeByDate(attendee.timeIn) || "N/A",
        TimeOut: formatTimeByDate(attendee.timeOut) || "N/A",
        ScannedBy: attendee.scannedBy || "N/A",
        Duration: attendee.duration || "N/A",
      }));

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Export the workbook to an XLSX file
    XLSX.writeFile(workbook, `${event.name || "event"}_attendance.xlsx`);
  };

  return (
    <div className="w-[100%]   xl:w-[75%] bg-white overflow-hidden">
      <div className="py-4 px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 w-full  mb-4 gap-1">
          <div className="col-span-11">
            <AttendanceSearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              event={event}
              getEvent={getEvent}
            />
          </div>

          <div className="col-span-1 flex justify-end ">
            <AppDropdown />
          </div>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-4  mb-4">
          <StatCard
            title="Pending"
            value={countStatus("pending")}
            variant="design1"
            icon={<FaCalendarDay className="text-3xl  my-1 mx-auto" />}
            classParent="bg-white p-6 border rounded-none border-gray-200 lg:rounded-l-lg"
            classIcon="bg-gray-100 text-gray-300"
          />
          <StatCard
            title="Present"
            value={countStatus("present")}
            variant="design1"
            icon={<BsPerson className="text-3xl  my-1 mx-auto" />}
            classParent="bg-white p-6 border rounded-none border-gray-200"
            classIcon="bg-blue-100 text-blue-300"
          />
          <StatCard
            title="Absent"
            value={countStatus("absent")}
            variant="design1"
            icon={<FaTimes className="text-3xl  my-1 mx-auto" />}
            classParent="bg-white p-6 border rounded-none border-gray-200"
            classIcon="bg-red-100 text-red-300"
          />
          <StatCard
            title="Completed"
            value={countStatus("completed")}
            variant="design1"
            icon={<FaCheck className="text-3xl my-1 mx-auto " />}
            classParent="bg-white p-6 border rounded-none border-gray-200 lg:rounded-r-lg"
            classIcon="bg-green-100 text-green-300 "
          />
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="text-green-500 border hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleExportToExcel} // Attach the export handler
          >
            <FaFileExcel className="mr-2" /> Export
          </button>
        </div>
        <div className="overflow-x-auto h-[600px] overflow-y-auto ">
          <Table
            headers={[
              "Name",
              "Expenses",
              "Status",
              "Time In",
              "Time Out",
              "Scanned By",
              "Duration",
            ]}
          >
            {votersAttendance &&
              votersAttendance.map((record: any, index: number) => (
                <TableRow
                  event={event}
                  key={index}
                  search={searchInput}
                  record={record}
                  index={index}
                  expandedRow={expandedRow}
                  toggleExpandedRow={toggleExpandedRow}
                  formatTimeByDate={formatTimeByDate}
                  getEvent={getEvent}
                />
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
