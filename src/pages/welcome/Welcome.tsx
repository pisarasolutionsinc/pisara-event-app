import { useEffect, useRef, useState } from "react";
import { BiQrScan, BiRefresh } from "react-icons/bi";
import { FiCamera } from "react-icons/fi";
import { useEvent } from "../../hooks/useEvent";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { useAuth } from "../../hooks/useAuth";
import { useScanner } from "../../hooks/useScanner";
import { useQRScanner } from "../../hooks/useQRScanner";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { usePerson } from "../../hooks/usePerson";
import { WELCOME } from "../../config/assets";

const WelcomePage = () => {
  const { auth } = useAuth();
  const { eventId } = useEvent();
  const { getPerson } = usePerson();
  const { getLocal } = useLocalStorage();
  const { createAttendanceFromScanner } = useEvent();

  const [activeTab, setActiveTab] = useState<"camera" | "device">("camera");
  const [isScanCooldown, setIsScanCooldown] = useState(false); // Cooldown state
  const [isRequestInProgress, setIsRequestInProgress] = useState(false); // Track request status
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for managing the timeout
  const [displayedName, setDisplayedName] = useState<string | null>(null);

  const [backgroundImage, setBackgroundImage] = useState<string>(
    WELCOME.BG_CAROUSEL[0]
  );
  const [isWelcomeDisplayed, setIsWelcomeDisplayed] = useState<boolean>(false);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabChange = (tab: "camera" | "device") => {
    setActiveTab(tab);
  };

  const handleScan = async (value: string) => {
    if (isScanCooldown || isRequestInProgress) return; // Prevent scanning if cooldown or request is in progress

    const getuserId = (auth.user && auth.user.id) || getLocal("auth").user.id;
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
          : eventId;

      const type =
        value.includes("-") && value.split("-")[2] !== "customId"
          ? "voter"
          : "customId";

      try {
        const result: any = await createAttendanceFromScanner(
          type,
          scannedValue,
          eventValue,
          getuserId
        );

        const findPerson: any = await getPerson(result.voter ?? "");
        if (findPerson) {
          setDisplayedName(
            findPerson?.name.firstname + " " + findPerson?.name.lastname
          );

          setIsWelcomeDisplayed(true); // Display welcome message
        }

        if (result && !Array.isArray(result)) {
          setIsScanCooldown(true);
          setTimeout(() => setIsScanCooldown(false), 3000);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsRequestInProgress(false);
      }
    }, 3000);
  };

  // Scanner hook
  const { result, videoRef, setResult } = useScanner(handleScan);
  const { inputRef } = useQRScanner(handleScan);

  // Background carousel logic
  useEffect(() => {
    if (!isWelcomeDisplayed) {
      carouselIntervalRef.current = setInterval(() => {
        setBackgroundImage((prevImage) => {
          const currentIndex = WELCOME.BG_CAROUSEL.indexOf(prevImage);
          const nextIndex = (currentIndex + 1) % WELCOME.BG_CAROUSEL.length;
          return WELCOME.BG_CAROUSEL[nextIndex];
        });
      }, 10000); // Change image every 10 seconds
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [isWelcomeDisplayed]);

  // Reset after 30 seconds
  useEffect(() => {
    if (isWelcomeDisplayed) {
      const resetTimeout = setTimeout(() => {
        setIsWelcomeDisplayed(false); // Hide welcome message and go back to carousel
        setDisplayedName(null);
        setResult(null);
      }, 10000); // 30-second timeout to reset

      return () => clearTimeout(resetTimeout);
    }
  }, [isWelcomeDisplayed]);
  return (
    <div className="min-h-screen">
      {isWelcomeDisplayed ? (
        <div
          className={`text-6xl font-bold bg-green-500 text-white h-[80vh] text-center flex justify-center items-center`}
        >
          <div>
            <h1>WELCOME!</h1>
            <span className="text-6xl capitalize"> {displayedName}</span>
          </div>
        </div>
      ) : (
        <div
          className={`text-6xl font-bold h-[80vh] text-center flex justify-center items-center`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div></div>
        </div>
      )}
      <div className="mt-4 flex overflow-hidden h-[16vh]">
        <div className="bg-white px-4 w-[10vw] z-50 shadow-xl border-r">
          <h2 className="text-xl font-bold"></h2>
          <div>
            <div className="flex justify-center my-4">
              <button
                className={`py-2 px-4 ${
                  activeTab === "camera"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } rounded-l-lg`}
                onClick={() => handleTabChange("camera")}
              >
                <FiCamera size={20} />
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "device"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } rounded-r-lg`}
                onClick={() => handleTabChange("device")}
              >
                <BiQrScan size={20} />
              </button>
            </div>
            <div>
              {activeTab === "camera" && (
                <div className="bg-white flex flex-col">
                  <div className="flex justify-center">
                    <video
                      ref={videoRef}
                      style={{ width: "0%", height: "0%" }}
                      className="rounded-t-lg"
                      autoPlay
                      muted
                    ></video>
                  </div>
                  <div className="bg-gray-100 px-4 py-2">
                    <div>
                      <div className="flex space-x-2 ">
                        <p className="text-gray-600 text-xs text-warap flex-wrap">
                          {result ? "Scanned" : "Scanning..."}
                        </p>
                        <BiRefresh
                          size={20}
                          className="cursor-pointer text-gray-600"
                          onClick={() => setResult("")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeTab === "device" && (
              <div className="bg-gray-100 px-4 py-2 relative">
                {/* Input Field */}
                <div className=" relative flex items-center">
                  {/* Icon Button with Tooltip */}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Scan here"
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="inline-block ml-2 cursor-pointer text-gray-500 relative group">
                    <button className=" text-lg rounded-full hover:text-blue-500 focus:outline-none">
                      <AiOutlineInfoCircle />
                    </button>

                    {/* Tooltip Content */}
                    <div className="absolute left-8 -mt-10 bg-white border border-gray-300 p-2 rounded shadow-lg z-10 w-64 hidden group-hover:block">
                      <p className="text-gray-600 text-xs">
                        <span className="font-bold">Note:</span> Use this option
                        if you are using a device (QR code scanner).
                      </p>
                      <p className="text-gray-600 text-xs">
                        <span className="font-bold">Instruction:</span> Click
                        the input field and scan the QR code using your device.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tooltip Container */}
              </div>
            )}
          </div>
        </div>
        <div className="carousel-container flex">
          <div className="carousel-content flex">
            {WELCOME.BOTTOM_CAROUSEL.map((imageSrc, index) => (
              <img
                key={index}
                className="w-[500px] mx-10  object-contain"
                src={imageSrc}
                alt={`Sample ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
