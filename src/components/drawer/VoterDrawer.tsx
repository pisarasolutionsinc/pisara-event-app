import Drawer from "../cards/Drawer";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import LocationPicker from "../filter/LocationPicker";
import {
  VoterStatusEnum,
  PersonCategoryEnum,
  PersonTypeEnum,
  PersonRoleEnum,
  GenderEnum,
} from "../../config/modelConfig";
import { Address } from "../../model/collectionModel";
import { BiDownload } from "react-icons/bi";
import { usePerson } from "../../hooks/usePerson";
import {
  Gender,
  PersonCategory,
  PersonRole,
  PersonType,
  VoterStatus,
} from "../../config/common";

import { MdGeneratingTokens } from "react-icons/md";
import { calculateAge } from "../../utils/useMath";
import Input from "../input/Input";
import { useEvent } from "../../hooks/useEvent";
import { useToast } from "../../context/ToastProvider";

interface VoterDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openFrom?: string;
  data?: any;
  getEvent?: (id: string) => Promise<any>;
}

const generateId = () => {
  // Function to generate a random ID (customize as needed)
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const VoterDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  openFrom = "voter",
  data,
  getEvent,
}: VoterDrawerProps) => {
  const { createPerson } = usePerson();
  const { createAttendanceMultipleAttendees } = useEvent();
  const [files, setFiles] = useState<File[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [customId, setCustomId] = useState<string>(generateId());
  const [location, setLocation] = useState<Address>({
    country: "Philippines",
    region: "",
    province: "",
    city: "",
    district: "",
    barangay: "",
    period: { start: "", end: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [date, setDate] = useState<string>("");

  const [gender, setGender] = useState<string>("male");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { showToast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [], // Accept any image type
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      const file = acceptedFiles[0];
      setCoverPhoto(URL.createObjectURL(file));
    },
  });

  const handleGenerateId = () => {
    setCustomId(generateId());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomId(e.target.value);
  };

  useEffect(() => {
    return () => {
      if (coverPhoto) {
        URL.revokeObjectURL(coverPhoto);
      }
    };
  }, [coverPhoto]);

  useEffect(() => {
    if (data?.location?.[0]) {
      setLocation({
        country: data.location[0].country || "Philippines",
        region: data.location[0].region || "",
        province: data.location[0].province || "",
        city: data.location[0].city || "",
        district: data.location[0].district || "",
        barangay: data.location[0].barangay || "",
        period: data.location[0].period || { start: "", end: "" },
      });
    }
  }, [data, isDrawerOpen]);

  const handleLocationChange = (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => {
    setLocation({
      country: "Philippines",
      region: region || "Unknown",
      province: province || "Unknown",
      city: municipality || "Unknown",
      district: municipality || "Unknown",
      barangay: barangay || "Unknown",
      period: { start: "", end: "" },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let genderEnum: Gender;
    switch (gender.toLowerCase()) {
      case "male":
        genderEnum = GenderEnum.MALE;
        break;
      case "female":
        genderEnum = GenderEnum.FEMALE;
        break;
      default:
        console.error("Invalid gender value");
        return; // or handle error as needed
    }

    const newEvent = {
      customId: customId,
      photo: coverPhoto || "",
      name: {
        firstname: firstName,
        middlename: middleName === "" ? undefined : middleName,
        lastname: lastName,
        suffix: suffix === "" ? undefined : suffix,
      },
      address: [location],
      contact: contact,
      email: email,
      age: calculateAge(date), // You might want to calculate age from date
      sex: genderEnum, // Use GenderEnum here
      birthday: date,
      status: VoterStatusEnum.ACTIVE as VoterStatus, // Convert status to enum
      role: PersonRoleEnum.VIEWER as PersonRole, // Convert role to enum
      type: PersonTypeEnum.MEMBER as PersonType, // Convert type to enum
      category: PersonCategoryEnum.VOTER as PersonCategory, // Convert category to enum
    };

    try {
      const response = await createPerson(newEvent);

      if (response) {
        setCustomId(generateId());
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setSuffix("");
        setCoverPhoto(null);
        setGender("male");
        setContact("");
        setEmail("");
        setDate("");
        setLocation({ ...location, period: { start: "", end: "" } });

        // Check if response is an array or a single Person object
        if (Array.isArray(response)) {
        } else {
          // Assuming response is a single Person object
          if (openFrom === "attendance") {
            createAttendanceMultipleAttendees([response._id as string]);
          }
        }
      }
      showToast("Voter created successfully", "success", "bottom-10 right-10");
      setIsLoading(false);
      setIsDrawerOpen(false);
      getEvent && getEvent(data._id as string);
    } catch (error) {
      setIsLoading(false);
      showToast("Failed to create voter", "error", "bottom-10 right-10");
      setIsDrawerOpen(false);
    }
  };

  return (
    <div>
      <Drawer
        isOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        title="Add Voter"
        bgColor="bg-white"
        titleColor="text-black"
      >
        <form className="p-4" onSubmit={handleSubmit}>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 text-center"
          >
            <input {...getInputProps()} />
            {coverPhoto ? (
              <img
                src={coverPhoto}
                alt="Cover"
                className="mx-auto mb-4 max-h-60"
              />
            ) : (
              <div className=" flex justify-center items-center ">
                <div className="text-center">
                  <BiDownload size={40} className="mx-auto mb-4" />
                  <p>Drag & drop a cover photo here, or click to select one</p>
                </div>
              </div>
            )}
          </div>
          {files.length > 0 && (
            <div className="mt-2">
              {files.map((file) => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          )}

          <div className="mt-4 relative">
            <label className="label-general block font-medium text-gray-700">
              Custom Id
            </label>
            <div className="relative">
              <input
                type="text"
                className="mt-1 block w-full text-sm border-gray-500 border rounded-md shadow-sm px-4 py-2 pr-10 focus:outline-none focus:ring-0"
                placeholder="Enter Custom Id"
                value={customId}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleGenerateId}
              >
                <MdGeneratingTokens className="text-xl text-gray-500" />
              </button>
            </div>
          </div>

          <Input
            label="First Name *"
            value={firstName}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"text"}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            label="Middle Name (optional)"
            value={middleName}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"text"}
            onChange={(e) => setMiddleName(e.target.value)}
          />

          <Input
            label="Last Name *"
            value={lastName}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"text"}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            label="Suffix Name (optional)"
            value={suffix}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"text"}
            onChange={(e) => setSuffix(e.target.value)}
          />
          <div className="mt-4">
            <LocationPicker
              onLocationChange={handleLocationChange}
              variant="grid"
            />
          </div>

          <Input
            label="Email *"
            value={email}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"email"}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contact *"
            value={contact}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"tel"}
            onChange={(e) => setContact(e.target.value)}
          />
          <Input
            label="Birthdate *"
            value={date}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"date"}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700">
              Gender
            </label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-0 capitalize"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              {Object.values(GenderEnum).map((gender, index) => (
                <option key={index} value={gender} className="capitalize">
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white text-xs md:text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Please Wait...
              </>
            ) : (
              " Add Voter"
            )}
          </button>
        </form>
      </Drawer>
    </div>
  );
};

export default VoterDrawer;
