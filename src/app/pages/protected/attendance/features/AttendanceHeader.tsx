import { useState } from "react";
import { ScannerSelect } from "../../../../components/selects/ScannerSelect";
import { BiCard, BiQrScan } from "react-icons/bi";
import { FiBox, FiCamera } from "react-icons/fi";
import { useProject } from "../../../../hooks/useProject";
import { WEBAPP } from "../../../../config/config";
import { FaRegPlayCircle, FaRegStopCircle } from "react-icons/fa";
import { IoIosQrScanner } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiGroup2Line } from "react-icons/ri";
import { Tab } from "../../../../components/buttons/Tab";

type ScannerOption = {
  id: number;
  name: string;
  icon: React.ReactNode;
};

export const AttendanceHeader = () => {
  const { currentProject: project } = useProject();
  const scannerData = [
    {
      id: 1,
      name: "Choose Scanner",
      icon: <IoIosQrScanner size={20} className="mx-auto" />,
    },
    { id: 2, name: "Camera", icon: <FiCamera size={20} className="mx-auto" /> },
    {
      id: 3,
      name: "Scanner",
      icon: <BiQrScan size={20} className="mx-auto" />,
    },
    {
      id: 4,
      name: "RFID Reader",
      icon: <BiCard size={20} className="mx-auto" />,
    },
  ];
  const [selectedScanner, setSelectedScanner] = useState<ScannerOption | null>(
    scannerData[0]
  );
  const [activeTab, setActiveTab] = useState("attendees");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const AttendanceTab = [
    {
      name: "Persons",
      tabValue: "attendees",
      icon: <IoPersonCircleOutline size={20} />,
      onClick: () => {
        const searchParams = new URLSearchParams();
        searchParams.set("tab", "attendees");
        setActiveTab("attendees");
      },
    },
    {
      name: "Groups",
      tabValue: "groups",
      icon: <RiGroup2Line size={20} />,
      onClick: () => {
        const searchParams = new URLSearchParams();
        searchParams.set("tab", "groups");
        setActiveTab("groups");
      },
    },
    {
      name: "Apps",
      tabValue: "apps",
      icon: <FiBox size={20} />,
      onClick: () => {
        const searchParams = new URLSearchParams();
        searchParams.set("tab", "apps");
        setActiveTab("apps");
      },
    },
  ];

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center  m-4 w-full gap-4 ">
        <img
          src={project?.image ? project.image : WEBAPP.LOGO}
          alt=""
          className="w-10 h-10"
        />
        <div className="flex gap-4 shadow-md bg-white max-w-sm rounded-full ">
          <ScannerSelect
            options={scannerData}
            selected={selectedScanner}
            onSelect={setSelectedScanner}
            placeholder="Select Scanner"
          />
          {selectedScanner?.id === 2 && (
            <div className="flex items-center justify-center bg-gray-100 p-2 rounded-full gap-2">
              <button
                onClick={() => setIsCameraOpen(!isCameraOpen)}
                className={`${
                  isCameraOpen ? "text-gray-500" : "text-gray-500"
                } cursor-pointer`}
              >
                {isCameraOpen ? (
                  <FaRegStopCircle size={20} />
                ) : (
                  <FaRegPlayCircle size={20} />
                )}
              </button>{" "}
              <span className="text-gray-500 cursor-default">
                {isCameraOpen ? "Scanning..." : "Tap to scan"}
              </span>
            </div>
          )}
        </div>
      </div>
      <div>
        <Tab
          tabs={AttendanceTab}
          activeTab={activeTab}
          containerClassName=""
          buttonClassName="border-b-2 border-gray-200"
          activeClassName="text-blue-500 border-b-4 border-blue-500"
          inactiveClassName=" text-black "
        />
      </div>
    </div>
  );
};
