import SearchInput from "../../../../components/inputs/SearchInput";
import { FiSettings } from "react-icons/fi";
import { BiExport, BiImport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useItem } from "../../../../hooks/useItem";
import { useProject } from "../../../../hooks/useProject";
import { SheetTable } from "../../../../components/table/SheetTable";
import { useEffect } from "react";
import _ from "lodash";

export const AttendeesList = () => {
  const { projectKey } = useProject();
  const { items, itemId, fetchItem } = useItem();
  const navigate = useNavigate();
  console.log("items:", items);

  useEffect(() => {
    const query = {
      _id: itemId,
    };

    fetchItem(query);
  }, [itemId]);

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <SearchInput
          placeholder="Search..."
          className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/${projectKey}/event/${itemId}/import`)}
            className=" text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center"
          >
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
