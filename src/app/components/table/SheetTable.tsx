import React, { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import { GiJigsawBox } from "react-icons/gi";
import { Field } from "../../models/fieldModels";
import { ATTENDACE_FIELD } from "../../config/fieldConfig";
import StatusDropdown from "../selects/StatusDropdown";
import {
  Header,
  RowData,
  SheetTableProps,
  StatusOption,
} from "../../models/tableModel";

export const SheetTable = ({
  headers: initialHeaders = [],
  initialRows = [],
  onSave,
}: SheetTableProps) => {
  const [headers, setHeaders] = useState<Header[]>(initialHeaders);
  const [rows, setRows] = useState<RowData[]>(initialRows);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  console.log("Headers:", headers);
  console.log("Rows:", rows);

  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  // Handle dropping the dragged column
  const handleDrop = (dropIndex: number) => {
    if (draggedColumnIndex !== null) {
      const updatedHeaders = [...headers];
      const [draggedHeader] = updatedHeaders.splice(draggedColumnIndex, 1);
      updatedHeaders.splice(dropIndex, 0, draggedHeader);
      setHeaders(updatedHeaders);
      setDraggedColumnIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle value changes in the table cells
  const handleCellChange = (
    rowIndex: number,
    headerType: string,
    value: string | string[]
  ) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][headerType] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const addRow = () => {
    const newRow: RowData = {};
    headers.forEach(
      (header) =>
        (newRow[header.type] = header.fieldType === "multiselect" ? [] : "")
    );
    setRows([...rows, newRow]);
  };

  // Add a selected field as a new header (column)
  const addHeaderFromField = () => {
    if (!selectedField) return;

    const statusOptions: StatusOption[] = [
      { value: "option1", label: "Option 1", color: "#4caf50" }, // Green
      { value: "option2", label: "Option 2", color: "#f44336" }, // Red
    ];

    const newHeader: Header = {
      id: headers.length + 1,
      name: selectedField.name,
      type: selectedField.category,
      fieldType: selectedField.type,
      option: selectedField.category === "status" ? statusOptions : [],
    };
    setHeaders([...headers, newHeader]);

    // Update existing rows to include the new column
    const updatedRows = rows.map((row) => ({
      ...row,
      [selectedField.category as any]:
        selectedField.type === "multiselect" ? [] : "",
    }));
    setRows(updatedRows);

    // Reset field selection and close the modal
    setSelectedField(null);
    setShowAddColumnModal(false);
  };

  // Delete a header (and its associated column in all rows)
  const deleteHeader = (headerType: string) => {
    const updatedHeaders = headers.filter(
      (header) => header.type !== headerType
    );
    setHeaders(updatedHeaders);

    // Update rows by removing the corresponding column data
    const updatedRows = rows.map((row) => {
      const updatedRow = { ...row };
      delete updatedRow[headerType];
      return updatedRow;
    });
    setRows(updatedRows);
  };

  const handleSave = () => {
    onSave && onSave(headers, rows);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-grow bg-gray-200 h-[2px]"></div>
        <button
          className="flex items-center py-2 rounded ml-2 text-gray-500 hover:text-green-500"
          onClick={() => setShowAddColumnModal(true)}
        >
          <p className="mr-2 text-xs">Add Column</p>
          <PiPlusCircle size={20} />
        </button>
      </div>
      <div className="overflow-auto max-h-[80vh]">
        {headers?.length > 0 ? (
          <table className="table-auto w-full border rounded-t-lg border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, index) => (
                  <th
                    key={header.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className="border-y border-gray-300 px-4 py-2 text-left cursor-move text-gray-500 font-normal"
                  >
                    <div className="flex items-center justify-between">
                      {header.name}
                      <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => deleteHeader(header.type)} // Delete button
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-y border-gray-300">
                  {headers.map((header) => (
                    <td key={header.id} className="border-y border-gray-300">
                      {header.fieldType === "singletext" && (
                        <input
                          type="text"
                          value={row[header.type] as string}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              header.type,
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 "
                        />
                      )}
                      {header.fieldType === "multiselect" && (
                        <select
                          multiple
                          value={row[header.type] as string[]}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              header.type,
                              Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              )
                            )
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                        </select>
                      )}
                      {header.fieldType === "singleselect" &&
                        header.type === "status" && (
                          <StatusDropdown
                            row={row}
                            header={header} // Pass the entire header object
                            rowIndex={rowIndex}
                            handleCellChange={handleCellChange}
                            statusOptions={header.option || []} // Use status options from header
                            setStatusOptions={(newOptions) => {
                              if (!Array.isArray(newOptions)) {
                                console.error(
                                  "newOptions is not an array:",
                                  newOptions
                                );
                                return;
                              }

                              setHeaders((prevHeaders) =>
                                prevHeaders.map((h) =>
                                  h.id === header.id
                                    ? { ...h, option: [...newOptions] }
                                    : h
                                )
                              );
                            }}
                            onAddStatus={(newStatus, newStatusColor) => {
                              const newStatusOption = {
                                value: newStatus,
                                label: newStatus,
                                color: newStatusColor,
                              };
                              setHeaders((prevHeaders) =>
                                prevHeaders.map((h) =>
                                  h.id === header.id
                                    ? {
                                        ...h,
                                        option: [
                                          ...(h.option || []),
                                          newStatusOption,
                                        ],
                                      }
                                    : h
                                )
                              );
                            }}
                            onDeleteStatus={(statusValue) => {
                              setHeaders((prevHeaders) =>
                                prevHeaders.map((h) =>
                                  h.id === header.id
                                    ? {
                                        ...h,
                                        option: (h.option || []).filter(
                                          (opt) => opt.value !== statusValue
                                        ),
                                      }
                                    : h
                                )
                              );
                            }}
                            onEditStatus={(
                              statusValue,
                              editLabel,
                              editColor
                            ) => {
                              setHeaders((prevHeaders) =>
                                prevHeaders.map((h) =>
                                  h.id === header.id
                                    ? {
                                        ...h,
                                        option: (h.option || []).map((opt) =>
                                          opt.value === statusValue
                                            ? {
                                                ...opt,
                                                label: editLabel,
                                                color: editColor,
                                              }
                                            : opt
                                        ),
                                      }
                                    : h
                                )
                              );
                            }}
                          />
                        )}

                      {header.fieldType === "time" && (
                        <input
                          type="time"
                          value={row[header.type] as string}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              header.type,
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 "
                        />
                      )}
                      {header.fieldType === "date" && (
                        <input
                          type="date"
                          value={row[header.type] as string}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              header.type,
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 "
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg">
            <GiJigsawBox size={50} className="mx-auto text-gray-400" />

            <p className=" text-center text-gray-400">No data</p>
          </div>
        )}

        {showAddColumnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">
                Add New Header (Column)
              </h2>
              <div className="flex flex-col space-y-4">
                <select
                  value={selectedField?.name || ""}
                  onChange={(e) =>
                    setSelectedField(
                      ATTENDACE_FIELD.find(
                        (field) => field.name === e.target.value
                      ) || null
                    )
                  }
                  className="p-2 border rounded"
                >
                  <option value="">Select a field</option>
                  {ATTENDACE_FIELD.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setShowAddColumnModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addHeaderFromField}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Column
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="flex items-center py-2 rounded ml-2 text-gray-500 hover:text-green-500"
          onClick={addRow}
        >
          <p className="mr-2 text-xs">Add Row</p>
          <PiPlusCircle size={20} />
        </button>
        <div className="flex-grow bg-gray-200 h-[2px]"></div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center py-1 rounded bg-green-500 text-white px-3"
        >
          Save
        </button>
      </div>
    </div>
  );
};
