import { useEffect, useState } from "react";
import SearchInput from "../../../../components/inputs/SearchInput";
import { FiSettings } from "react-icons/fi";
import { BiExport, BiImport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useItem } from "../../../../hooks/useItem";
import { useProject } from "../../../../hooks/useProject";
import { SheetTable } from "../../../../components/table/SheetTable";
import { Header, RowData } from "../../../../models/tableModel";
import { Item } from "../../../../models/itemModels";
import { useToast } from "../../../../../context/ToastProvider";

export const AttendeesList = () => {
  const { projectKey } = useProject();
  const { showToast } = useToast();
  const { item, itemId, getCustomFieldValue, updateItem } = useItem();
  const navigate = useNavigate();
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    const fetchedHeaders = getCustomFieldValue("Fields", item as Item) || [];
    const fetchedRows = getCustomFieldValue("Attendees", item as Item) || [];

    console.log("Rows:", fetchedRows);
    setHeaders(fetchedHeaders);
    setRows(fetchedRows);
  }, [item]);

  const cleanFieldId = (data: any): any => {
    data.fields.custom.forEach((field: any) => {
      field.fieldId = field.fieldId._id;
    });

    return data;
  };

  const handleSave = async (
    updatedHeaders: Header[],
    updatedRows: RowData[]
  ) => {
    console.log("Headers:", updatedHeaders);
    console.log("Rows:", updatedRows);

    try {
      const updatedItemData: Item = {
        ...item,
        fields: {
          common: item?.fields?.common || [], // Ensures common is always an array
          custom: (item?.fields?.custom || []).map((customField) => {
            const updatedField = {
              ...customField,
              fieldId: {
                ...customField.fieldId,
                _id: customField.fieldId._id,
              },
            };

            if (customField.fieldId.name === "Attendees") {
              updatedField.value = updatedRows; // Update the 'Attendees' field with rows
            }

            if (customField.fieldId.name === "Fields") {
              updatedField.value = updatedHeaders; // Update the 'Fields' field with headers
            }

            return updatedField;
          }),
        },
      };

      const response = await updateItem(cleanFieldId(updatedItemData));

      if (response) {
        showToast("Successfully updated item", "success", "bottom-10 right-10");
      }
    } catch (error) {
      console.error("Error updating item data:", error);
    }
  };

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
            className="text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center"
          >
            <BiImport size={20} className="mx-auto" />
            <span>Import</span>
          </button>
          <button className="text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center">
            <BiExport size={20} className="mx-auto" />
            <span>Export</span>
          </button>
          <button className="text-gray-500 hover:bg-gray-50 hover:text-green-500 rounded-md px-3 py-2 flex gap-2 items-center">
            <FiSettings size={20} className="mx-auto" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {headers.length > 0 && rows.length > 0 && (
        <SheetTable headers={headers} initialRows={rows} onSave={handleSave} />
      )}
    </div>
  );
};
