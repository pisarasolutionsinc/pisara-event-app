import React from "react";
import TableHeader from "./TableHeader";

interface TableProps {
  headers: React.ReactNode[];
  children: React.ReactNode;
  className?: string;
}

const Table = ({ headers, children, className }: TableProps) => {
  return (
    <div className={`relative ${className}`}>
      <table className="min-w-full bg-white">
        <thead className="sticky top-0 bg-white border-b z-10">
          <tr className="border-b border-gray-100 text-gray-700 text-xs md:text-sm">
            <TableHeader columns={headers} />
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
