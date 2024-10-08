import Drawer from "../cards/Drawer";
import { useState, useRef } from "react";
import LocationPicker from "../filter/LocationPicker";
import { GenderEnum } from "../../config/modelConfig";
import { Address } from "../../model/collectionModel";
import { usePerson } from "../../hooks/usePerson";
import { Gender } from "../../config/common";
import { calculateAge } from "../../utils/useMath";
import Input from "../input/Input";
import { useEvent } from "../../hooks/useEvent";
import { useToast } from "../../context/ToastProvider";
import { uploadFileToCloudinary } from "../../services/cloudinaryService";
import { MdGeneratingTokens } from "react-icons/md";
import { dataURLtoBlob } from "../../app/utils/useBlob";
import { Person } from "../../model/personModel";
import { FaCamera, FaRedo } from "react-icons/fa";

interface VoterDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  page?: string;
  data?: any;
  getEvent?: (id: string) => Promise<any>;
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const VoterDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  page = "voter",
  getEvent,
}: VoterDrawerProps) => {
  const { createPerson } = usePerson();
  const { eventId, createEventAttendance } = useEvent();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleGenerateId = () => {
    setCustomId(generateId());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomId(e.target.value);
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      showToast("Failed to access camera", "error", "bottom-10 right-10");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        setCapturedImage(dataURL);
        stopCamera();
      }
    }
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

    const genderEnum =
      gender.toLowerCase() === "male" ? GenderEnum.MALE : GenderEnum.FEMALE;

    let uploadedPhotoUrl = "";

    try {
      // Check if there's an image to upload
      if (capturedImage) {
        // Convert the base64 image string to a Blob
        const imageBlob = dataURLtoBlob(capturedImage);

        // Create a File from the Blob (optional, depends on what Cloudinary expects)
        const file = new File([imageBlob], `${customId}-photo.png`, {
          type: imageBlob.type,
        });

        // Upload the file to Cloudinary
        const { secure_url } = await uploadFileToCloudinary(file, "voters");
        uploadedPhotoUrl = secure_url; // Store the uploaded URL
      }

      const newAttendee: Person = {
        customId,
        photo: uploadedPhotoUrl || "", // Use uploaded photo URL or empty string
        name: {
          firstname: firstName.toLowerCase(),
          middlename: middleName ? middleName.toLowerCase() : undefined,
          lastname: lastName.toLowerCase(),
          suffix: suffix ? suffix.toLowerCase() : undefined,
        },
        organization,
        occupation,
        address: [location],
        contact,
        email: email.toLowerCase(),
        age: calculateAge(date),
        sex: genderEnum,
        birthday: date,
      };

      const response = await createPerson(newAttendee);

      // Check if the response is an array or a single person object
      const person = Array.isArray(response) ? response[0] : response;

      if (person) {
        setCustomId(generateId());
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setSuffix("");
        setCapturedImage(null);
        setGender("male");
        setContact("");
        setEmail("");
        setDate("");
        setOrganization("");
        setOccupation("");
        setLocation({ ...location, period: { start: "", end: "" } });

        if (page === "attendance") {
          const result = await createEventAttendance(person._id ?? "", eventId); // Use person._id here

          if (result) {
            setIsLoading(false);
            setIsDrawerOpen(false);
            getEvent && getEvent(eventId as any);
          }
        } else {
          showToast(
            "Attendee created successfully",
            "success",
            "bottom-10 right-10"
          );
          setIsLoading(false);
          setIsDrawerOpen(false);
        }
      }
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
        title="Add Attendee"
        bgColor="bg-white"
        titleColor="text-black"
      >
        <form className="p-4 mb-10" onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="label-general block font-medium text-gray-700">
              Camera
            </label>

            {!capturedImage && (
              <div className="relative w-full h-auto bg-gray-200">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-auto bg-gray-200"
                />

                {isCameraActive ? (
                  <button
                    type="button"
                    onClick={handleCaptureImage}
                    className="absolute bottom-4 border border-blue-600 hover:bg-blue-600 text-white rounded-md left-1/2 transform -translate-x-1/2 btn-primary flex items-center justify-center px-4 py-2"
                  >
                    <FaCamera className="mr-2" />
                    Capture
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="absolute inset-0  btn-secondary flex items-center justify-center px-4 py-2"
                  >
                    <FaCamera className="mr-2" />
                    Start Camera
                  </button>
                )}
              </div>
            )}

            {capturedImage && (
              <div className="mt-4">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-auto"
                />
                <button
                  type="button"
                  onClick={() => setCapturedImage(null)}
                  className="mt-2 btn-danger flex items-center justify-center px-4 py-2"
                >
                  <FaRedo className="mr-2" />
                  Retake
                </button>
              </div>
            )}
          </div>

          {/* Canvas element to capture image */}
          <canvas ref={canvasRef} width="640" height="480" className="hidden" />
          <div className="mt-4 relative ">
            <label className="label-general block font-medium text-gray-700">
              Custom Id
            </label>
            <div className="relative ">
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
          <div className="grid grid-cols-2 gap-4">
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
            label="Email (optional)"
            value={email}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"email"}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contact (optional)"
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
      </Drawer>
    </div>
  );
};

export default VoterDrawer;
