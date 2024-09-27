import { useEvent } from "../../../../../hooks/useEvent";
import { FiCalendar, FiCamera, FiClock } from "react-icons/fi";
import { useScanner } from "../../../../../hooks/useScanner";
import { useQRScanner } from "../../../../../hooks/useQRScanner";
import { BiQrScan, BiRefresh } from "react-icons/bi";
import { Sling as Hamburger } from "hamburger-react";
import { Attendance } from "../../../../../model/attendanceModel";
import { useEffect, useState, useRef } from "react";
import QrCodeModal from "../../../../../components/modals/QrCodeModal";
import MoneyModal from "../../../../../components/modals/MoneyModal";
import { useAttendance } from "../../../../../hooks/useAttendance";
import { FaLocationPin } from "react-icons/fa6";
import LeaderList from "../../list/LeaderList";
import { useAuth } from "../../../../../hooks/useAuth";
import { useLocalStorage } from "../../../../../utils/useLocalStorage";
import { EventStatusEnum } from "../../../../../config/modelConfig";
import { useToast } from "../../../../../context/ToastProvider";
import LoadingOverlay from "../../../../../components/lazy/LoadingOverlay";

interface Props {
  toggled: boolean;
  toggle: () => void;
  event: any;
  getEvent?: (id: string) => Promise<any>;
}

const AttendanceSidebar = ({ toggled, toggle, event, getEvent }: Props) => {
  const { auth } = useAuth();
  const { getLocal } = useLocalStorage();
  const { updateAttendance } = useAttendance();
  const { createAttendanceFromScanner, updateEvent } = useEvent();
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"camera" | "device">("camera");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isOpenModalExpenses, setIsOpenModalExpenses] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isScanCooldown, setIsScanCooldown] = useState(false); // Cooldown state
  const [isRequestInProgress, setIsRequestInProgress] = useState(false); // Track request status
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for managing the timeout
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setUserId(auth.user.id);
    }
  }, [auth.user]);
  const handleTabChange = (tab: "camera" | "device") => {
    setActiveTab(tab);
  };

  const handleStatusChange = async (status: any) => {
    setLoading(true);

    try {
      if (!event) return;
      const data = {
        _id: event?._id,
        status: status,
      };
      const updatedEvent = await updateEvent(data);

      if (updatedEvent) {
        setLoading(false);
        showToast(
          "Event status updated successfully",
          "success",
          "bottom-10 right-10"
        );
        getEvent && getEvent(updatedEvent._id as string);
      } else {
        setLoading(false);
        showToast(
          "Failed to update event status",
          "error",
          "bottom-10 right-10"
        );
      }
    } catch (error) {
      setLoading(false);
      showToast("Failed to update event status", "error", "bottom-10 right-10");
    }
  };

  const handleScan = async (value: string) => {
    console.log(value);
    // setScannedValue(value);
    // setResult(value);
    if (isScanCooldown || isRequestInProgress) return; // Prevent scanning if cooldown or request is in progress

    const getuserId =
      userId || (auth.user && auth.user.id) || getLocal("auth").user.id;
    if (!getuserId) {
      console.error("User ID is missing.");
      return;
    }

    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout for processing the scanned value
    timeoutRef.current = setTimeout(async () => {
      setIsRequestInProgress(true); // Set request in progress

      const scannedValue = value.includes("-") ? value.split("-")[1] : value;
      const eventValue =
        value.includes("-") && value.split("-")[2] !== "customId"
          ? value.split("-")[2]
          : event?._id;

      const type =
        value.includes("-") && value.split("-")[2] !== "customId"
          ? "voter"
          : "customId";

      try {
        const result = await createAttendanceFromScanner(
          type,
          scannedValue,
          eventValue,
          getuserId
        );

        if (result && !Array.isArray(result)) {
          const getResult: Attendance = result;
          const status = getResult.status;
          const value = `UID-${getResult.voter}-${getResult.event}`;
          const expenses = getResult.expenses;

          if (status === "present" && getEvent) {
            setQrCodeValue(value);
            setIsOpenModal(true);
            getEvent(getResult.event ?? "");
          } else if (status === "completed" && expenses === 0 && getEvent) {
            setIsOpenModalExpenses(true);
            setAttendance(getResult);
            getEvent(getResult.event ?? "");
          }

          // Activate cooldown after successful scan
          setIsScanCooldown(true);
          setTimeout(() => setIsScanCooldown(false), 3000); // 3-second cooldown
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsRequestInProgress(false); // Reset request in progress state
      }
    }, 3000); // 3-second delay
  };

  const { result, videoRef, setResult } = useScanner(handleScan);
  const { inputRef } = useQRScanner(handleScan);

  const handleSave = async (amount: number, result: Attendance | null) => {
    if (result && amount > 0) {
      try {
        result.expenses = amount;
        const response = await updateAttendance(result);

        if (response) {
          setIsOpenModal(false);
          setQrCodeValue(null);
          getEvent?.(result.event ?? "");
        }
      } catch (error) {
        console.error("Error:", error);
        setIsOpenModal(false);
        setQrCodeValue(null);
      }
    }
  };

  return (
    <div className=" w-[100%]  xl:w-[25%] bg-white h-full py-2 px-4 border-r">
      <div className="hidden   md:flex md:items-center  md:justify-between ">
        {" "}
        <Hamburger toggled={toggled} toggle={toggle} size={20} color="grey" />
        <div className="flex justify-center my-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "camera" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-l-lg`}
            onClick={() => handleTabChange("camera")}
          >
            <FiCamera size={20} />
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "device" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-r-lg`}
            onClick={() => handleTabChange("device")}
          >
            <BiQrScan size={20} />
          </button>
        </div>
      </div>

      {/* Tab Switcher */}

      {/* Camera Tab Content */}
      {activeTab === "camera" && (
        <div className="bg-white flex flex-col">
          <div className="flex-grow">
            <video
              ref={videoRef}
              style={{ width: "100%", height: "100%" }}
              className="rounded-t-lg"
              autoPlay
              muted
            ></video>
          </div>
          <div className="bg-gray-100 px-4 py-2">
            <div>
              {result ? (
                <div className="flex space-x-2">
                  <p>Result: {result}</p>
                  <BiRefresh
                    size={20}
                    className="cursor-pointer text-gray-600"
                    onClick={() => setResult("")}
                  />
                </div>
              ) : (
                <p className="text-gray-600 text-xs">
                  Scan a QR code to see the result here.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Device Import Tab Content */}
      {activeTab === "device" && (
        <div className="bg-gray-100 px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan here"
            className="border p-2 w-full"
          />
          <div className="mt-2 space-y-1">
            <p className="text-gray-600 text-xs">
              <span className="font-bold">Note:</span> Use this option if you
              are using a device (QR code scanner)
            </p>
            <p className="text-gray-600 text-xs">
              <span className="font-bold">Instruction:</span> Click the Input
              field and scan the QR code
            </p>
          </div>
        </div>
      )}

      {/* <input
        ref={inputRef}
        type="text"
        style={{ position: "absolute", left: "-9999px" }}
      /> */}

      <div className="mt-2 p-4">
        <h1 className="text-sm text-gray-400 border-b pb-2">Event Details</h1>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8">
            {/* Skeleton Loader for Event Name */}
            {!event ? (
              <h1 className="h-6 bg-gray-200 animate-pulse text-gray-700 lg:text-sm xl:text-lg font-bold" />
            ) : (
              <h1 className="lg:text-sm xl:text-lg font-bold text-gray-700">
                {event.name}
              </h1>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-6 gap-2 text-xs items-center mt-2">
              {/* Skeleton Loader for Date */}
              <div className="flex space-x-2 items-center xl:col-span-2">
                {!event ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FiCalendar />
                    <p>{event.date}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center xl:col-span-4">
                {/* Skeleton Loader for Time */}
                {!event ? (
                  <div className="flex gap-2 text-gray-700">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                    </div>
                    <p className="text-gray-500">to</p>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse ml-2" />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 text-gray-700">
                    <p className="flex items-center">
                      <FiClock />
                      <span>
                        {event.startTime
                          ? new Date(event.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </p>
                    <p className="flex items-center text-gray-500">to</p>
                    <p className="flex items-center">
                      <FiClock />
                      <span>
                        {event.endTime
                          ? new Date(event.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!event ? (
              <p className="text-sm text-gray-700 flex items-center mt-2">
                <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-2" />
                <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
              </p>
            ) : (
              <p className="text-sm text-gray-700 flex items-center mt-2">
                <FaLocationPin className="text-gray-500 mr-2" />
                Brgy. {event.location[0]?.barangay}, {event.location[0]?.city},{" "}
                {event.location[0]?.province}
              </p>
            )}
          </div>

          <div className="xl:col-span-4 xl:border-l mt-2 border-gray-200 px-4">
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                className={`flex text-xs py-1 font-semibold border rounded-full w-full uppercase ${
                  event?.status.toLocaleUpperCase() === "ACTIVE" ||
                  event?.status.toLocaleUpperCase() === "DONE"
                    ? "text-green-500 border-green-500"
                    : event?.status.toLocaleUpperCase() === "CANCELED"
                    ? "text-red-500 border-red-500"
                    : event?.status.toLocaleUpperCase() === "INACTIVE"
                    ? "text-yellow-500 border-yellow-500"
                    : "text-gray-500 border-gray-500"
                }`}
                value={event?.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {Object.values(EventStatusEnum).map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="text-xs py-1 font-semibold uppercase text-gray-500"
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 h-[100px]">
          <h1 className="text-sm text-gray-400 border-b pb-2 ">Leader/s</h1>
          <LeaderList event={event} />
        </div>
      </div>

      <QrCodeModal
        data={event}
        qrValue={qrCodeValue ? qrCodeValue : null}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
      <MoneyModal
        result={attendance}
        isOpen={isOpenModalExpenses}
        onClose={() => setIsOpenModalExpenses(false)}
        onSave={(amount, result) => handleSave(amount, result)}
      />
      <LoadingOverlay
        isVisible={loading}
        width={50}
        height={50}
        border={5}
        borderTop={5}
      />
    </div>
  );
};

export default AttendanceSidebar;
