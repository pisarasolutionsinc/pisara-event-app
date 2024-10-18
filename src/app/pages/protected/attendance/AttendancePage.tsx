import { AttendanceHeader } from "./features/AttendanceHeader";
import { AttendeesList } from "./features/AttendeesList";

export const AttendancePage = () => {
  return (
    <div className="w-full h-full ">
      <AttendanceHeader />
      <div className="grid grid-cols-12 w-full h-[90vh]">
        <div className="col-span-9 border-r border-gray-200">
          <AttendeesList />
        </div>
        <div className="col-span-3 p-5 bg-gray-100/50 text-gray-300">
          Coming soon..
        </div>
      </div>
    </div>
  );
};
