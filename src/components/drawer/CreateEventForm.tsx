import { useState, useEffect, useRef } from "react";
import { useEvent } from "../../hooks/useEvent";
import { Person } from "../../model/personModel";
import LocationPicker from "../filter/LocationPicker";
import { EventStatus, EventCategory } from "../../config/modelConfig";
import { Address } from "../../model/collectionModel";
import Drawer from "../cards/Drawer";
import Input from "../input/Input";
import { Event } from "../../model/eventsModel";
import { usePerson } from "../../hooks/usePerson";
import { useToast } from "../../context/ToastProvider";
import LeaderSelector from "../input/LeaderSelector";
import UploadCard from "../cards/UploadCard";
import { debounce } from "../../utils/useDebounce";
import {
  removeFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../services/cloudinaryService";

interface VoterDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
}

const CreateEventForm = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
}: VoterDrawerProps) => {
  const { createEvent } = useEvent();
  const { searchPerson } = usePerson();
  const [files, setFiles] = useState<File[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [leaderInput, setLeaderInput] = useState<string>("");
  const [selectedLeaders, setSelectedLeaders] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string[] | []>([]);
  const [location, setLocation] = useState<Address>({
    country: "",
    region: "",
    province: "",
    city: "",
    district: "",
    barangay: "",
    period: { start: "", end: "" },
  });
  const [eventName, setEventName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [organizer, setOrganizer] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const { showToast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced leader search
  useEffect(() => {
    const debouncedFetchSuggestions = debounce(async () => {
      if (leaderInput.trim() === "") {
        setShowSuggestions(false);
        return;
      }

      try {
        const results = await searchPerson("name.firstname", leaderInput);
        setSearch((results as any) || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
        setShowSuggestions(false);
      }
    }, 500);

    debouncedFetchSuggestions();

    return () => {
      debouncedFetchSuggestions.cancel && debouncedFetchSuggestions.cancel();
    };
  }, [leaderInput, searchPerson]);

  const handleLeaderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setLeaderInput(value);
  };

  // Upload cover photo to Cloudinary
  const handleFileUpload = async (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const response = await uploadFileToCloudinary(file, "events");
        setCoverPhoto(response.secure_url);
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

  const handleSuggestionClick = (suggestion: Person) => {
    if (!selectedLeaders.some((leader) => leader._id === suggestion._id)) {
      setSelectedLeaders([...selectedLeaders, suggestion]);
    }
    setLeaderInput("");
    setShowSuggestions(false);
  };

  const handleRemoveLeader = (id: string) => {
    setSelectedLeaders(selectedLeaders.filter((leader) => leader._id !== id));
  };

  const handleInputClick = () => {
    inputRef.current?.focus();
  };

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
  };

  const convertToISO = (date: string, time: string): string => {
    if (!date || !time) {
      console.error("Invalid date or time provided");
      return "";
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      console.error("Invalid date format");
      return "";
    }

    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(time)) {
      console.error("Invalid time format");
      return "";
    }

    const dateTimeString = `${date}T${time}:00`;

    try {
      const dateTime = new Date(dateTimeString);
      if (isNaN(dateTime.getTime())) {
        throw new RangeError("Invalid time value");
      }
      return dateTime.toISOString();
    } catch (error) {
      console.error("Error creating ISO string:", error);
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if location is provided
    if (
      location["region"] === "" ||
      location["province"] === "" ||
      location["city"] === "" ||
      location["barangay"] === ""
    ) {
      setIsLoading(false);
      showToast("Location is required", "error", "bottom-10 right-10");
      return;
    }

    const newEvent: Event = {
      name: eventName,
      description,
      date,
      startTime: startTime ? convertToISO(date, startTime) : "",
      endTime: endTime ? convertToISO(date, endTime) : "",
      location: [location],
      coverPhoto: coverPhoto ?? "", // Use Cloudinary URL
      photos:
        files.length > 0 ? files.map((file) => URL.createObjectURL(file)) : [],
      leaders: (selectedLeaders.map((leader) => leader._id) as any) || [],
      organizer,
      link,
      totalExpenses: 0,
      status: "pending" as EventStatus,
      category: "other" as EventCategory,
      totalAttendees: 0,
      template: {
        id: [],
        welcome: [],
        certificate: ["66ff7b636d0f5e00279b3164"],
      },
    };

    try {
      const response = await createEvent(newEvent);
      if (response) {
        setEventName("");
        setDescription("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setLink("");
        setCoverPhoto(null);
        setFiles([]);
        setSelectedLeaders([]);
        setLeaderInput("");
        setOrganizer("");
        setShowSuggestions(false);
        setLocation({
          country: "Philippines",
          region: "Unknown",
          province: "Unknown",
          city: "Unknown",
          district: "Unknown",
          barangay: "Unknown",
          period: { start: "", end: "" },
        });

        setIsDrawerOpen(false);
        onSave();
        showToast(
          "Event created successfully",
          "success",
          "bottom-10 right-10"
        );
      } else {
        console.error("Failed to create event");
        showToast("Failed to create event", "error", "bottom-10 right-10");
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      showToast("Failed to create event", "error", "bottom-10 right-10");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      title="Create Event"
      bgColor="bg-white"
      titleColor="text-black"
    >
      <form className="p-4" onSubmit={handleSubmit}>
        <div className="flex space-x-4 border-b-2 mb-2">
          <button
            className={`py-2 px-4 ${
              activeTab === "upload" ? "border-b-2 border-blue-500" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("upload")}
          >
            Upload
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "url" ? "border-b-2 border-blue-500" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("url")}
          >
            URL
          </button>
        </div>

        {activeTab === "upload" ? (
          <UploadCard
            onFileUpload={handleFileUpload}
            variant="image"
            handleDelete={handleDeleteFile}
          />
        ) : (
          <Input
            label="Photo URL (optional)"
            value={(coverPhoto as string) || ""}
            variant={"inputwithoverlapping"}
            componentType={"input"}
            inputType={"url"}
            onChange={(e) => setCoverPhoto(e.target.value)}
          />
        )}
        {files.length > 0 && activeTab === "upload" && (
          <div className="mt-2">
            {files.map((file) => (
              <div key={file.name}>{file.name}</div>
            ))}
          </div>
        )}

        <Input
          label="Event Name *"
          value={eventName}
          variant={"inputwithoverlapping"}
          componentType={"input"}
          inputType={"text"}
          onChange={(e) => setEventName(e.target.value)}
        />
        <Input
          label="Description (optional)"
          value={description}
          componentType="textarea"
          variant="inputwithoverlapping"
          row={5}
          inputType={"text"}
          onChange={(e) => setDescription(e.target.value)}
          classParent="-mb-2"
        />
        <Input
          label="Organizer (optional)"
          value={organizer}
          componentType={"input"}
          variant="inputwithoverlapping"
          inputType={"text"}
          onChange={(e) => setOrganizer(e.target.value)}
        />

        <LeaderSelector
          selectedLeaders={selectedLeaders}
          leaderInput={leaderInput}
          search={search}
          showSuggestions={showSuggestions}
          handleLeaderInputChange={handleLeaderInputChange}
          handleInputClick={handleInputClick}
          handleRemoveLeader={handleRemoveLeader}
          handleSuggestionClick={handleSuggestionClick}
        />

        <Input
          label="Date *"
          value={date}
          componentType="input"
          variant="inputwithoverlapping"
          inputType={"date"}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className=" flex justify-between gap-2">
          <div className="w-full">
            <Input
              label="Start Time *"
              value={startTime}
              componentType="input"
              variant="inputwithoverlapping"
              inputType={"time"}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="w-full">
            <Input
              label="End Time *"
              value={endTime}
              componentType="input"
              variant="inputwithoverlapping"
              inputType={"time"}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-1">
          <label className=" text-xs  text-gray-400">Location</label>
          <LocationPicker
            onLocationChange={handleLocationChange}
            variant="grid"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white text-xs md:text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
          disabled={isLoading}
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
            " Create Event"
          )}
        </button>
      </form>
    </Drawer>
  );
};

export default CreateEventForm;
