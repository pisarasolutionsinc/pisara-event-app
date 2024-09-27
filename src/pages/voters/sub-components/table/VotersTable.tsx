import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  expandedPage?: boolean;
}

const VotersTable = ({ headers, children, expandedPage }: TableProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr className="text-3xl sm:text-sm md:text-xs xl:text-ms font-bold">
          {headers.map((header, index) =>
            expandedPage && header.toLowerCase() !== "name" ? null : (
              <th
                key={index}
                className={`px-6 py-3 font-medium text-gray-500  tracking-wider ${
                  header.toLowerCase() === "actions"
                    ? "text-center"
                    : "text-left"
                } ${
                  header.toLowerCase() === "type"
                    ? "hidden md:table-cell xl:table-cell"
                    : ""
                }`}
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  );
};

export default VotersTable;
