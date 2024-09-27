import MoneyModal from "../../../../../components/modals/MoneyModal";
import QrCodeModal from "../../../../../components/modals/QrCodeModal";
import { AttendanceStatusEnum } from "../../../../../config/modelConfig";
import { useAttendance } from "../../../../../hooks/useAttendance";
import { useGeneral } from "../../../../../hooks/useGeneral";
import { useState } from "react";
import { Attendance } from "../../../../../model/attendanceModel";
import { useLocalStorage } from "../../../../../utils/useLocalStorage";
import LoadingOverlay from "../../../../../components/lazy/LoadingOverlay";
import { useToast } from "../../../../../context/ToastProvider";
import LocationPicker from "../../../../../components/filter/LocationPicker";
import { Address } from "../../../../../model/collectionModel";
import { displayValue } from "./../../../../../utils/useFormatter";
import { usePerson } from "../../../../../hooks/usePerson";

interface TableRowProps {
  event: any;
  record: any;
  index: number;
  search?: string;
  expandedRow: number | null;
  toggleExpandedRow: (index: number) => void;
  formatTimeByDate: (date: string) => string;
  getEvent?: (id: string) => Promise<any>;
}

const TableRow = ({
  event,
  record,
  index,
  search,
  expandedRow,
  toggleExpandedRow,
  formatTimeByDate,
  getEvent,
}: TableRowProps) => {
  const { getInitials } = useGeneral();
  const { updateAttendance } = useAttendance();
  const { updatePerson } = usePerson();
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);
  const [status, setStatus] = useState(record.status);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isOpenModalExpenses, setIsOpenModalExpenses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [formData, setFormData] = useState<any | null>({
    name: {
      lastname: displayValue(record.voter.name.lastname),
      firstname: displayValue(record.voter.name.firstname),
      middlename: displayValue(record.voter.name.middlename),
    },
    email: displayValue(record.voter.email),
    contact: displayValue(record.voter.contact),
    address: {
      region: displayValue(record.voter.address[0].region),
      province: displayValue(record.voter.address[0].province),
      city: displayValue(record.voter.address[0].city),
      barangay: displayValue(record.voter.address[0].barangay),
    },
  });

  const handleFieldChange = (name: string, value: string) => {
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormData((prevData: any) => ({
        ...prevData,
        [keys[0]]: value,
      }));
    } else if (keys.length === 2) {
      setFormData((prevData: any) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    }

    setFormChanged(true);
  };

  const [location, setLocation] = useState<Address>({
    country: "" || "Philippines",
    region: "",
    province: "",
    city: "",
    district: "",
    barangay: "",
    period: { start: "", end: "" },
  });
  console.log(location);
  const { getLocal } = useLocalStorage();
  const { showToast } = useToast();

  const handleLocationChange = (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => {
    setLocation({
      country: "Philippines",
      region: region || "",
      province: province || "",
      city: municipality || "",
      district: municipality || "",
      barangay: barangay || "",
      period: { start: "", end: "" },
    });
    setFormData((prevData: any) => ({
      ...prevData,
      address: {
        ...prevData.address,
        region: region || "",
        province: province || "",
        city: municipality || "",
        district: municipality || "",
        barangay: barangay || "",
      },
    }));

    setFormChanged(true);
  };

  const hasChanges = () => {
    console.log("Form data:", formData);
    console.log("Record data:", record.voter);
    return (
      formData.name.lastname !== displayValue(record.voter.name.lastname) ||
      formData.name.firstname !== displayValue(record.voter.name.firstname) ||
      formData.name.middlename !== displayValue(record.voter.name.middlename) ||
      formData.email !== displayValue(record.voter.email) ||
      formData.contact !== displayValue(record.voter.contact) ||
      formData.address.region !==
        displayValue(record.voter.address[0].region) ||
      formData.address.province !==
        displayValue(record.voter.address[0].province) ||
      formData.address.city !== displayValue(record.voter.address[0].city) ||
      formData.address.barangay !==
        displayValue(record.voter.address[0].barangay)
    );
  };

  const handleStatusChange = async (newStatus: string, index: number) => {
    setStatus(newStatus); // Update the local state
    setLoading(true);
    try {
      let updatedRecord;
      const getLocalResult = getLocal("auth");
      updatedRecord = {
        event: event._id,
        voter: record.voter && record.voter._id,
        scannedBy:
          getLocalResult && getLocalResult.user && getLocalResult.user.id,
        status: newStatus,
      };

      // console.log(updatedRecord);
      const response: any = await updateAttendance(updatedRecord); // Call updateAttendance with the updated data
      // console.log(response);
      if (response) {
        showToast(
          "Attendance status updated successfully to " + newStatus,
          "success",
          "bottom-10 right-10"
        );
        setLoading(false);
        getEvent && getEvent(event._id);
        const value = `UID-${response.voter._id}-${response.event._id}`;
        if (response.status === "present") {
          setQrCodeValue(value);
          setIsOpenModal(true);
          toggleExpandedRow(index);
        } else if (response.status === "completed" && response.expenses === 0) {
          setIsOpenModalExpenses(true);
          setAttendance(response);
          toggleExpandedRow(index); // Open the expanded row
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to update attendance:", error);
      showToast("Failed to update attendance", "error", "bottom-10 right-10");
    }
  };

  const handleSave = async (amount: number, result: Attendance | null) => {
    // console.log(result, amount);
    if (result && amount > 0) {
      try {
        const getLocalResult = getLocal("auth");

        result.expenses = amount;
        result.scannedBy =
          getLocalResult && getLocalResult.user && getLocalResult.user.id;
        const response = await updateAttendance(result);

        // console.log(response);
        if (response) {
          showToast(
            "Expense added successfully",
            "success",
            "bottom-10 right-10"
          );
          setIsOpenModal(false);
          setIsOpenModalExpenses(false);
          setQrCodeValue(null);
          getEvent && getEvent(event._id);
        }
      } catch (error) {
        showToast(
          "Failed to add expense: " + error,
          "error",
          "bottom-10 right-10"
        );
        setIsOpenModal(false);
        setIsOpenModalExpenses(false);
        setQrCodeValue(null);
      }
    }
  };

  const handleCancel = () => {
    // Reset the form to the initial values
    setLocation({
      country: "Philippines",
      region: record.voter.address[0].region || "",
      province: record.voter.address[0].province || "",
      city: record.voter.address[0].city || "",
      barangay: record.voter.address[0].barangay || "",
    });

    setFormData((prevData: any) => ({
      ...prevData,
      name: {
        lastname: displayValue(record.voter.name.lastname),
        firstname: displayValue(record.voter.name.firstname),
        middlename: displayValue(record.voter.name.middlename),
      },
      email: displayValue(record.voter.email),
      contact: displayValue(record.voter.contact),
      address: {
        region: displayValue(record.voter.address[0].region),
        province: displayValue(record.voter.address[0].province),
        city: displayValue(record.voter.address[0].city),
        barangay: displayValue(record.voter.address[0].barangay),
      },
    }));
    setFormChanged(false); // Reset the change state
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updatedRecord = {
        ...record.voter,
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        address: [location],
      };
      await updatePerson(updatedRecord);
      setFormChanged(false); // Reset the change state after save
      setLoading(false);
      showToast("Changes saved successfully", "success", "bottom-10 right-10");
    } catch (error) {
      setLoading(false);
      showToast("Failed to save changes", "error", "bottom-10 right-10");
    }
  };

  const renderContent = () => {
    return (
      <div className=" grid gap-4 grid-cols-12 ">
        <div className="col-span-8">
          <form action="" className="xl:border-r pr-4">
            <div className="grid grid-cols-3 gap-4 border-b py-2">
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Last name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md focus:border px-4 py-2 focus:outline-none focus:ring-0"
                  value={formData.name?.lastname}
                  onChange={(e) =>
                    handleFieldChange("name.lastname", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  First name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md focus:border px-4 py-2 focus:outline-none focus:ring-0"
                  value={formData.name?.firstname}
                  onChange={(e) =>
                    handleFieldChange("name.firstname", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Middle name
                </label>
                <input
                  type="text"
                  value={formData.name?.middlename}
                  className="mt-1 block w-full border-gray-300 rounded-md focus:border px-4 py-2 focus:outline-none focus:ring-0"
                  onChange={(e) =>
                    handleFieldChange("name.middlename", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md focus:border text-sm px-4 py-2 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleFieldChange("contact", e.target.value)} // Changed to capture input value
                  className="mt-1 block w-full border-gray-300 rounded-md focus:border px-4 py-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mt-1">
                <label className="block text-xs font-medium text-gray-300">
                  Address
                </label>
                <LocationPicker
                  onLocationChange={handleLocationChange}
                  variant="grid2"
                  defaultLocation={{
                    region: formData.address.region,
                    province: formData.address.province,
                    city: formData.address.city,
                    barangay: formData.address.barangay,
                  }}
                />
              </div>
            </div>
            {formChanged && hasChanges() && (
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="col-span-4">
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-300">
              Status
            </label>
            <select
              className={`${
                record.status === "present"
                  ? "text-blue-600 bg-blue-100 rounded-full px-2 py-1"
                  : record.status === "absent"
                  ? "text-red-600 bg-red-100 rounded-full px-2 py-1"
                  : record.status === "completed"
                  ? "text-green-600 bg-green-100 rounded-full px-2 py-1"
                  : "text-gray-600 bg-gray-100 rounded-full px-2 py-1"
              } mt-1 block w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-0 uppercase`}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value, index)}
            >
              {/* <option value="">{status}</option> */}
              {Object.values(AttendanceStatusEnum).map((status) => (
                <option
                  key={status}
                  value={status}
                  className="uppercase bg-white text-gray-500"
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <tr
        key={index}
        className={` ${
          expandedRow === index ? "" : "border-b border-gray-100"
        }  text-gray-700 text-xs md:text-sm  ${
          record.voter?.name?.firstname &&
          record.voter?.name?.lastname &&
          (
            record.voter.name.firstname.toLowerCase() +
            " " +
            record.voter.name.lastname.toLowerCase()
          ).includes(search?.toLowerCase() || "")
            ? ""
            : "hidden"
        }`}
      >
        <td className="py-2 px-4  ">
          <button
            onClick={() => toggleExpandedRow(index)}
            className={`${
              expandedRow === index
                ? "text-blue-500 font-semibold"
                : "text-gray-500"
            } capitalize hover:text-blue-600 hover:font-semibold  `}
          >
            {record.voter?.name?.firstname.toLowerCase() || "---"}{" "}
            {record.voter?.name?.lastname.toLowerCase() || "---"}
          </button>
        </td>
        <td className="py-2 px-4 text-nowrap hidden md:table-cell text-right">
          {record.expenses === 0 ? "---" : "Php " + record.expenses?.toFixed(2)}
        </td>
        <td className="py-2 px-4 text-center">
          <span
            className={`${
              record.status === "present"
                ? "text-blue-600 bg-blue-100 rounded-full px-2 py-1"
                : record.status === "absent"
                ? "text-red-600 bg-red-100 rounded-full px-2 py-1"
                : record.status === "completed"
                ? "text-green-600 bg-green-100 rounded-full px-2 py-1"
                : "text-gray-600 bg-gray-100 rounded-full px-2 py-1"
            }  py-1 px-4`}
          >
            {record.status?.toUpperCase() || "---"}
          </span>
        </td>
        <td className="py-2 px-4 hidden lg:table-cell text-center">
          {record.timeIn ? formatTimeByDate(record.timeIn) : "---"}
        </td>
        <td className="py-2 px-4 hidden lg:table-cell text-center">
          {record.timeOut ? formatTimeByDate(record.timeOut) : "---"}
        </td>
        <td className="py-2 px-4 hidden lg:table-cell text-center">
          {record.scannedBy?.firstname || "---"}{" "}
          {record.scannedBy?.lastname || "---"}
        </td>
        <td className="py-2 px-4 hidden lg:table-cell text-center">
          {record.duration === "0h" ? "---" : record.duration || "---"}
        </td>
      </tr>

      {expandedRow === index && (
        <tr
          key={`expanded-${index}`}
          className={`${
            expandedRow === index ? "border-b border-gray-100" : ""
          } transition-all duration-100 ease-in-out bg-gray-100/40`}
        >
          <td colSpan={8} className="p-4">
            <div className="space-y-2 grid grid-cols-2 lg:hidden">
              <p>
                <strong>Time In:</strong>{" "}
                {record.timeIn && formatTimeByDate(record.timeIn)}
              </p>
              <p>
                <strong>Time Out:</strong>{" "}
                {record.timeOut && formatTimeByDate(record.timeOut)}
              </p>
              <p>
                <strong>Scanned By:</strong> {record.scannedBy?.firstname || ""}{" "}
                {record.scannedBy?.lastname || ""}
              </p>
              <p>
                <strong>Duration:</strong> {record.duration || "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-12 text-gray-500">
              <div className="flex gap-4 col-span-2 w-full">
                <div className="px-4 flex justify-center items-center w-full">
                  {record.voter?.photo && !isBrokenImage ? (
                    <img
                      src={record.voter.photo}
                      alt={`${record.voter?.name?.firstname || ""} ${
                        record.voter?.name?.lastname || ""
                      }`}
                      className="w-24 h-24 rounded-full border-2 border-gray-300"
                      onError={() => {
                        setIsBrokenImage(true);
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-500 text-white text-2xl font-bold rounded-full">
                      {getInitials(
                        `${record.voter?.name?.firstname || ""} ${
                          record.voter?.name?.lastname || ""
                        }`
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-10">
                {/* Tab Content */}
                <div className="tab-content p-4 bg-white ">
                  {renderContent()}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

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
    </>
  );
};

export default TableRow;
