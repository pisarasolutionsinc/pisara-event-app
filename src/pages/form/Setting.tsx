import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";

const SettingFormPage = () => {
  const [isFormEnabled, setIsFormEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const getHost = window.location.host;
  const { id } = useParams();
  const url = `http://${getHost}/survey/${id}/view?access=public`;

  const handleToggle = () => {
    setIsFormEnabled((prevState) => !prevState);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide the message after 2 seconds
  };

  return (
    <div className="p-4 w-3/4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold">Form Settings</h2>
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded ${
            isFormEnabled ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {isFormEnabled ? "On" : "Off"}
        </button>
      </div>

      {isFormEnabled && (
        <>
          <p className="text-gray-500 mb-4">
            Share this link with your voters:
          </p>
          <div className="flex items-center justify-between bg-slate-200 rounded-lg p-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {url}
            </a>
            <button onClick={handleCopyLink} className="ml-2 text-gray-500">
              <FaCopy />
            </button>
            {copied && <span className="ml-2 text-green-500">Copied!</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingFormPage;
