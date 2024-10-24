import { useState } from "react";
import { AttendanceHeader } from "./features/AttendanceHeader";
import { AttendeesList } from "./features/AttendeesList";
import { AttendanceReportsContainer } from "./features/AttendanceReportsContainer";
import { AttendanceGroupContainer } from "./features/AttendanceGroupContainer";
import { AttendanceAppContainer } from "./features/AttendanceAppContainer";
import { Header, RowData } from "../../../models/tableModel";

type ScannerOption = {
  id: number;
  name: string;
  icon: React.ReactNode;
};

export const AttendancePage = () => {
  const [selectedScanner, setSelectedScanner] = useState<ScannerOption | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraDisplay, setIsCameraDisplay] = useState(false);
  const [rows, setRows] = useState<RowData[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);

  console.log("rows", rows);

  return (
    <div className="w-full h-full">
      <AttendanceHeader
        selectedScanner={selectedScanner}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedScanner={setSelectedScanner}
        isCameraOpen={isCameraOpen}
        setIsCameraOpen={setIsCameraOpen}
        isCameraDisplay={isCameraDisplay}
        setIsCameraDisplay={setIsCameraDisplay}
      />
      <div className="grid grid-cols-12 w-full h-[90vh] ">
        <div
          className={`${
            activeTab === ""
              ? "col-span-12 transition-all duration-1000 ease-in-out"
              : "col-span-9 border-r border-gray-200 transition-all duration-1000 ease-in-out"
          }`}
        >
          <AttendeesList
            rows={rows}
            setRows={setRows}
            headers={headers}
            setHeaders={setHeaders}
          />
        </div>

        <div
          className={`col-span-3 bg-gray-100/50 text-gray-1000 transition-all duration-300 ease-in-out ${
            activeTab !== "" ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            overflow: "hidden",
            transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          {activeTab === "reports" ? (
            <AttendanceReportsContainer
              rows={rows}
              headers={headers}
              onClose={() => setActiveTab("")}
            />
          ) : activeTab === "groups" ? (
            <AttendanceGroupContainer />
          ) : activeTab === "apps" ? (
            <AttendanceAppContainer />
          ) : null}
        </div>
      </div>
    </div>
  );
};
