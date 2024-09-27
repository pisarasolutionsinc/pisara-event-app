import { useState } from "react";
import { FaCheck, FaTimes, FaCalendarDay } from "react-icons/fa";
import { formatTimeByDate } from "../../utils/useDateAndTime";
import { StatCard } from "../../components/cards/StatCard";
import Table from "./sub-components/table/attendance/Table";
import TableRow from "./sub-components/table/attendance/TableRow";

import AttendanceSearchBar from "../../components/search/AttendanceSearchBar";
import { BsPerson } from "react-icons/bs";

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

  return (
    <div className="w-[100%]   xl:w-[75%] bg-white">
      <div className="py-4 px-4 w-full">
        <AttendanceSearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          event={event}
          getEvent={getEvent}
        />
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

        <div className="overflow-x-auto h-[700px] overflow-y-auto ">
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
