import { useState, useEffect } from "react";

import LocationPicker from "../../components/filter/LocationPicker";
import {
  VoterStatusEnum,
  PersonCategoryEnum,
  PersonTypeEnum,
  PersonRoleEnum,
  GenderEnum,
} from "../../config/modelConfig";
import { Address } from "../../model/collectionModel";
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
import Input from "../../components/input/Input";
import { useEvent } from "../../hooks/useEvent";
import { useToast } from "../../context/ToastProvider";
import UploadCard from "../../components/cards/UploadCard";

import {
  removeFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../services/cloudinaryService";

const generateId = () => {
  // Function to generate a random ID (customize as needed)
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const RegistrationPage = () => {
  const { createPerson } = usePerson();

  const { createAttendanceMultipleAttendees, eventId } = useEvent();
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [customId, setCustomId] = useState<string>(generateId());
  const [organization, setOrganization] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
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

  const handleFileUpload = async (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const response = await uploadFileToCloudinary(file, "events"); // Upload to Cloudinary folder 'events'
        setCoverPhoto(response.secure_url); // Set Cloudinary URL as the cover photo
        setPublicId(response.public_id);
        showToast(
          "Cover photo uploaded successfully",
          "success",
          "bottom-10 right-10"
        );
      } catch (error) {
        console.error("Failed to upload cover photo:", error);
        showToast(
          "Failed to upload cover photo",
          "error",
          "bottom-10 right-10"
        );
      }
    }
  };

  const handleDeleteFile = () => {
    try {
      console.log(publicId);
      const response = removeFileFromCloudinary(publicId as string);
      console.log(response, "response");
      if (response) {
        setCoverPhoto(null);
        setPublicId("");
        console.log("File deleted successfully:", response);
        showToast(
          "Cover photo deleted successfully",
          "success",
          "bottom-10 right-10"
        );
      } else {
        setCoverPhoto(null);
        setPublicId("");
        console.error("Failed to delete file");
        showToast(
          "Failed to delete cover photo",
          "error",
          "bottom-10 right-10"
        );
      }
    } catch (error) {
      console.error("Error during file deletion:", error);
      showToast("Failed to delete cover photo", "error", "bottom-10 right-10");
    }
    setCoverPhoto(null);
  };

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
        firstname: firstName.toLowerCase(),
        middlename:
          middleName.toLowerCase() === ""
            ? undefined
            : middleName.toLowerCase(),
        lastname: lastName.toLowerCase(),
        suffix: suffix.toLowerCase() === "" ? undefined : suffix.toLowerCase(),
      },
      organization: organization || "",
      occupation: occupation || "",
      address: [location],
      contact: contact,
      email: email.toLowerCase(),
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
        setOrganization("");
        setOccupation("");
        setLocation({ ...location, period: { start: "", end: "" } });

        // Check if response is an array or a single Person object
        if (Array.isArray(response)) {
        } else {
          // Assuming response is a single Person object
          if (eventId) {
            const result = await createAttendanceMultipleAttendees(
              [response._id as string],
              eventId
            );

            if (result) {
              showToast(
                "Attendee created successfully",
                "success",
                "bottom-10 right-10"
              );
              setIsLoading(false);
            }
          } else {
            showToast(
              "Attendee created successfully",
              "success",
              "bottom-10 right-10"
            );
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      showToast("Failed to create voter", "error", "bottom-10 right-10");
    }
  };

  return (
    <div className=" grid grid-cols-1  p-5">
      <div className="lg:mx-[20%] xl:mx-[30%]">
        <form className="p-4" onSubmit={handleSubmit}>
          <UploadCard
            onFileUpload={handleFileUpload}
            variant="image"
            handleDelete={handleDeleteFile}
          />
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
          <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-4">
            <Input
              label="Organization (optional)"
              value={organization}
              variant={"inputwithoverlapping"}
              componentType={"input"}
              inputType={"text"}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <Input
              label="Occupation (optional)"
              value={occupation}
              variant={"inputwithoverlapping"}
              componentType={"input"}
              inputType={"text"}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
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
              " Add Attendee"
            )}
          </button>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default RegistrationPage;
