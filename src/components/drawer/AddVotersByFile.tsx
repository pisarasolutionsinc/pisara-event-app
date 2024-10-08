import { useState, useEffect } from "react";
import {
  FaEllipsisH,
  FaFile,
  FaFileExcel,
  FaFilePdf,
  FaImage,
} from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import UploadCard from "../cards/UploadCard";
import Drawer from "./../cards/Drawer";
import { usePerson } from "../../hooks/usePerson";
import { Person } from "../../model/personModel";
import { useAttendance } from "../../hooks/useAttendance";
import { useToast } from "../../context/ToastProvider";
import { useConverter } from "../../hooks/useConverter";
import ConfirmationCard from "../cards/ConfimationCard";

interface AddVotersByFileDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event?: any;
  getEvent?: (id: string) => Promise<any>;
}

const AddVotersByFileDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  event,
  getEvent,
}: AddVotersByFileDrawerProps) => {
  const [dropdownStates, setDropdownStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [totalPersons, setTotalPersons] = useState<{ [key: number]: number }>(
    {}
  );
  const [successCounts, setSuccessCounts] = useState<{ [key: number]: number }>(
    {}
  );

  const [failCounts, setFailCounts] = useState<{ [key: number]: number }>({});
  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { handleGetData, handleDeleteFile, handleFileUpload, uploadedFiles } =
    useConverter();

  const { createPerson } = usePerson();
  const { createAttendance } = useAttendance();
  const { showToast } = useToast();

  // Function to reset progress states
  const resetProgressStates = () => {
    setTotalPersons({});
    setSuccessCounts({});
    setFailCounts({});
    setIsUploading({});
  };

  const toggleDropdown = (index: number) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const handleDeleteFileClick = (index: number) => {
    handleDeleteFile(index);
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [index]: false,
    }));
    setIsUploading((prev) => ({ ...prev, [index]: false }));
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);

    if (selectedFile && selectedIndex !== null) {
      await handleAddVoters(selectedFile, event, selectedIndex);
    }
    setSelectedFile(null);
    setSelectedIndex(null);
  };

  const handleCancelUpload = () => {
    setShowConfirmation(false);
    setSelectedFile(null);
    setSelectedIndex(null);
  };

  const handleAddVoters = async (file: File, eventData: any, index: number) => {
    let success = 0;
    let failure = 0;

    try {
      setIsUploading((prev) => ({ ...prev, [index]: true }));
      const model: Person[] = await handleGetData(file, eventData, "get");

      if (model && model.length > 0) {
        for (const person of model) {
          try {
            const data = await createPerson(person);
            if (!data) {
              console.error("Error creating person:", data);
            }
            const persons = Array.isArray(data) ? data : [data];
            if (event) {
              for (const person of persons as Person[]) {
                const createResult = await createAttendance({
                  voter: person._id,
                  event: event._id,
                  date: new Date().toISOString(),
                  uploadBy: "file",
                  status: "pending",
                  duration: "0h",
                  expenses: 0,
                });
                if (createResult) {
                  success++;
                  setSuccessCounts((prev) => ({ ...prev, [index]: success }));
                }
              }
            }
          } catch (error) {
            console.error(
              `Error creating person with customId: ${person.customId}`,
              error
            );
            failure++;
            setFailCounts((prev) => ({ ...prev, [index]: failure }));
          }
        }

        if (getEvent) {
          getEvent(event._id);
          if (success > 0) {
            showToast(
              `Successfully added ${success} attendees. You now have a total of ${event.attendees.length} attendees.`,
              "success",
              "bottom-10 right-10"
            );
          } else {
            showToast(
              `Unable to add new attendees due to existing entries or invalid data. You currently have ${event.attendees.length} attendees.`,
              "error",
              "bottom-10 right-10"
            );
          }
        }
      } else {
        showToast(
          `No valid data to create persons. You currently have ${event.attendees.length} attendees.`,
          "error",
          "bottom-10 right-10"
        );
      }
    } catch (error) {
      showToast(
        `Error processing file: ${error}`,
        "error",
        "bottom-10 right-10"
      );
    } finally {
      // Ensure the uploading state is turned off
      setSuccessCounts({});
      setFailCounts({});
      setIsUploading((prev) => ({ ...prev, [index]: false }));
      success = 0;
      failure = 0;
    }
  };

  const getTotalPersonsInFile = async (file: File, index: number) => {
    try {
      const model: Person[] = await handleGetData(file, null, "get");
      setTotalPersons((prevTotals) => ({
        ...prevTotals,
        [index]: model.length,
      }));
    } catch (error) {
      console.error("Error getting total persons in file:", error);
      setTotalPersons((prevTotals) => ({ ...prevTotals, [index]: 0 }));
    }
  };

  // Reset progress and get file data whenever files change
  useEffect(() => {
    resetProgressStates();
    uploadedFiles.forEach((file, index) => {
      getTotalPersonsInFile(file, index);
    });
  }, [uploadedFiles]);

  return (
    <div>
      <Drawer
        isOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        title="Add Attendees By File"
        bgColor="bg-white"
        titleColor="text-black"
      >
        <div className="p-4">
          <UploadCard variant="custom" onFileUpload={handleFileUpload} />
          <div className="mt-4">
            <h2 className="text-sm font-bold mb-2 text-gray-500">
              Uploaded Files:
            </h2>
            <div>
              {uploadedFiles.map((file, index) => (
                <div
                  className="relative mb-2 p-4 border-b border-gray-200 bg-white"
                  key={index}
                >
                  <div className="absolute top-0 right-4">
                    <button onClick={() => toggleDropdown(index)}>
                      <FaEllipsisH size={15} className="text-gray-500" />
                    </button>
                    {dropdownStates[index] && (
                      <div className="absolute right-0 w-56 bg-white rounded-md shadow-xl z-10">
                        <ul className="py-1 text-gray-700 w-full">
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setDropdownStates({
                                  ...dropdownStates,
                                  [index]: false,
                                });
                                handleGetData(file, event);
                              }}
                            >
                              View Data
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                handleDeleteFileClick(index);
                              }}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="">
                    <div className="flex items-center gap-2">
                      <div>
                        {file.name.includes(".pdf") ? (
                          <FaFilePdf size={20} className="text-red-500" />
                        ) : file.name.includes(".xlsx") ||
                          file.name.includes(".csv") ? (
                          <FaFileExcel size={20} className="text-green-500" />
                        ) : file.name.includes(".png") ||
                          file.name.includes(".jpg") ||
                          file.name.includes(".jpeg") ? (
                          <FaImage size={20} className="text-blue-500" />
                        ) : (
                          <FaFile size={20} className="text-gray-500" />
                        )}
                      </div>
                      <p>{file.name}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-gray-500 text-sm">
                          {totalPersons[index] !== undefined
                            ? `${totalPersons[index]} Persons`
                            : "Loading..."}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setSelectedFile(file);
                            setSelectedIndex(index);
                            setShowConfirmation(true);
                          }}
                          className={` ${
                            showConfirmation && index === selectedIndex
                              ? "text-white bg-green-500"
                              : ""
                          } flex items-center text-red-500 hover:text-white hover:bg-green-500 border rounded-full gap-2 px-2`}
                        >
                          <BiPlusCircle /> Add Attendees
                        </button>
                        {showConfirmation && index === selectedIndex && (
                          <div className="relative z-20">
                            <ConfirmationCard
                              title="Confirm Upload"
                              message="Are you sure you want to add attendee(s) from this file?"
                              onConfirm={handleConfirmUpload}
                              onCancel={handleCancelUpload}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {isUploading[index] && (
                      <div className="mt-4">
                        <p className="text-sm">Upload Progress:</p>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full absolute top-0 left-0 transition-all duration-300 ${
                              successCounts[index] === totalPersons[index]
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: `${
                                (successCounts[index] / totalPersons[index]) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-sm mt-1">
                          {successCounts[index] ?? 0} successful,{" "}
                          {failCounts[index] ?? 0} existing or failed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default AddVotersByFileDrawer;
