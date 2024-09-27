import React from "react";

interface TableHeaderProps {
  columns: React.ReactNode[] | string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  // Define columns that need special classes
  const hiddenColumns = new Set([
    "Duration",
    "Time In",
    "Time Out",
    "Scanned By",
  ]);

  return (
    <>
      {columns.map((column, index) => {
        const isHidden = hiddenColumns.has(column as string);
        return (
          <th
            key={index}
            className={`py-2 px-4  text-gray-400 font-normal  ${
              isHidden
                ? "hidden lg:table-cell"
                : column === "Action"
                ? ""
                : column === "Expenses"
                ? "hidden md:table-cell"
                : ""
            } ${
              column === "Name"
                ? "text-left"
                : column === "Expenses"
                ? "text-right"
                : "text-center"
            }`}
          >
            {column}
          </th>
        );
      })}
    </>
  );
};

export default TableHeader;
