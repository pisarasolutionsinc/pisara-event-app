import { BiCard, BiQrScan } from "react-icons/bi";
import { FiBox, FiCamera } from "react-icons/fi";
import { FaRegPlayCircle, FaRegStopCircle } from "react-icons/fa";
import { IoIosQrScanner } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { RiGroup2Line } from "react-icons/ri";
import { ScannerSelect } from "../../../../components/selects/ScannerSelect";
import { Tab } from "../../../../components/buttons/Tab";
import { useProject } from "../../../../hooks/useProject";
import { WEBAPP } from "../../../../config/config";
import { LuCamera, LuCameraOff } from "react-icons/lu";

// Types
type ScannerOption = {
  id: number;
  name: string;
  icon: React.ReactNode;
};

type AttendanceHeaderProps = {
  selectedScanner: ScannerOption | null;
  setSelectedScanner: (selected: ScannerOption | null) => void;
  activeTab: string;
  setActiveTab: (active: string) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  isCameraDisplay: boolean;
  setIsCameraDisplay: (display: boolean) => void;
};

// Reusable Tab Component for Attendance
const AttendanceTab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    {
      name: "Reports",
      tabValue: "reports",
      icon: <IoAnalytics size={20} />,
      onClick: () => setActiveTab("reports"),
    },
    {
      name: "Groups",
      tabValue: "groups",
      icon: <RiGroup2Line size={20} />,
      onClick: () => setActiveTab("groups"),
    },
    {
      name: "Apps",
      tabValue: "apps",
      icon: <FiBox size={20} />,
      onClick: () => setActiveTab("apps"),
    },
  ];

  return (
    <Tab
      tabs={tabs}
      activeTab={activeTab}
      containerClassName=""
      buttonClassName="border-b-2 border-gray-200"
      activeClassName="text-blue-500 border-b-4 border-blue-500"
      inactiveClassName="text-black"
    />
  );
};

// Reusable Scanner Select and Camera Toggle Component
const ScannerWithCameraToggle = ({
  selectedScanner,
  setSelectedScanner,
  isCameraOpen,
  setIsCameraOpen,
  isCameraDisplay,
  setIsCameraDisplay,
}: {
  selectedScanner: ScannerOption | null;
  setSelectedScanner: (scanner: ScannerOption | null) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  isCameraDisplay: boolean;
  setIsCameraDisplay: (display: boolean) => void;
}) => {
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

  return (
    <div className="flex gap-4 shadow-md bg-white max-w-sm rounded-full">
      <ScannerSelect
        options={scannerData}
        selected={selectedScanner}
        onSelect={setSelectedScanner}
        placeholder="Select Scanner"
      />
      {selectedScanner?.id === 2 && (
        <div className="flex items-center justify-center bg-gray-100 p-2 rounded-full gap-2">
          <button
            onClick={() => setIsCameraDisplay(!isCameraDisplay)}
            className="text-gray-500 cursor-pointer"
          >
            {isCameraDisplay ? (
              <LuCamera size={20} />
            ) : (
              <LuCameraOff size={20} />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCameraOpen(!isCameraOpen)}
              className="text-gray-500 cursor-pointer"
            >
              {isCameraOpen ? (
                <FaRegStopCircle size={20} />
              ) : (
                <FaRegPlayCircle size={20} />
              )}
            </button>
            <span className="text-gray-500 cursor-default">
              {isCameraOpen ? "Scanning..." : "Tap to scan"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export const AttendanceHeader = ({
  selectedScanner,
  setSelectedScanner,
  activeTab,
  setActiveTab,
  isCameraOpen,
  setIsCameraOpen,
  isCameraDisplay,
  setIsCameraDisplay,
}: AttendanceHeaderProps) => {
  const { currentProject: project } = useProject();

  return (
    <div className="w-full flex justify-between items-center px-4">
      <div className="flex items-center m-4 w-full gap-4">
        <img
          src={project?.image ? project.image : WEBAPP.LOGO}
          alt=""
          className="w-10 h-10"
        />
        <ScannerWithCameraToggle
          selectedScanner={selectedScanner}
          setSelectedScanner={setSelectedScanner}
          isCameraOpen={isCameraOpen}
          setIsCameraOpen={setIsCameraOpen}
          isCameraDisplay={isCameraDisplay}
          setIsCameraDisplay={setIsCameraDisplay}
        />
      </div>
      <AttendanceTab activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
