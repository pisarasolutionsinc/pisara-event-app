import { SheetTable } from "../../../../components/table/SheetTable";
import SearchInput from "../../../../components/inputs/SearchInput";
import { FiSettings } from "react-icons/fi";
import { BiExport, BiImport } from "react-icons/bi";

export const PersonList = () => {
  const AttendanceHeader = [
    // { id: 1, name: "Fullname", type: "name", fieldType: "singletext" },
    // { id: 2, name: "Email", type: "email", fieldType: "singletext" },
    // { id: 3, name: "Phone", type: "phone", fieldType: "singletext" },
    // { id: 4, name: "Address", type: "address", fieldType: "multitext" },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <SearchInput
          placeholder="Search..."
          className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
        <div className="flex gap-3">
          <button className=" text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center">
            <BiImport size={20} className="mx-auto" />
            <span>Import</span>
          </button>
          <button className=" text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center">
            <BiExport size={20} className="mx-auto" />
            <span>Export</span>
          </button>
          <button className=" text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center">
            <FiSettings size={20} className="mx-auto" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <SheetTable headers={[]} />
    </div>
  );
};
