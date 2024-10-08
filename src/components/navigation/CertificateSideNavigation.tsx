import { useState } from "react";
import { MdAddCircle, MdSave } from "react-icons/md";

interface CertificateProps {
  person?: any;
  template?: any;
  defaultCertificate?: any;
  selectedCertificate?: any;
  onChange?: (field: string, value: string) => void;
}

export const CertificateLeftSideNavigation = ({
  template = [], // Provide a default empty array
}: CertificateProps) => {
  console.log("template: ", template);

  return (
    <div className="p-4 bg-[#ffeeee] min-h-screen h-full">
      <div className="h-full p-5 bg-[#3d3d3d] rounded-lg">
        <h1 className="text-lg font-semibold text-white border-b pb-2 border-gray-600">
          Templates
        </h1>
        <div className="flex flex-col gap-2 mt-4">
          <button className="flex items-center gap-2 p-2 bg-[#636363] rounded-lg text-white">
            <MdAddCircle /> Create New Template
          </button>
        </div>
        <div className="mt-4">
          {template.length > 0 ? ( // Check if length is greater than 0
            template.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 text-white mt-2 p-2 bg-[#444444] rounded-lg"
              >
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-xs mt-1">
                  {item.event.name} - {item.event.date}
                </p>

                {/* <div className="flex flex-wrap gap-1 mt-2">
                  {item.signatories &&
                    item.signatories.length > 0 && // Check if signatories exist and have length
                    item.signatories.map((signatory: any) => (
                      <span
                        key={signatory._id}
                        className="text-xs bg-[#636363] rounded-full px-2"
                      >
                        {signatory.name} - {signatory.position}
                      </span>
                    ))}
                </div> */}
              </div>
            ))
          ) : (
            <p className="text-white">No templates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const CertificateRightSideNavigation = ({
  person,
  defaultCertificate,
  selectedCertificate,
  onChange,
}: CertificateProps) => {
  const [activeTab, setActiveTab] = useState<string>("information");

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(field, e.target.value); // Call onChange with field name and new value
      }
    };

  const renderTabContent = () => {
    switch (activeTab) {
      case "information":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Title
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.title}
                onChange={handleInputChange("title")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Title Caption
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.titleCaption}
                onChange={handleInputChange("titleCaption")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Awardee
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white capitalize"
                value={person?.name?.firstname + " " + person?.name?.lastname}
                readOnly // Assuming this is read-only; remove if editable
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Awardee Caption
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.awardeeCaption}
                onChange={handleInputChange("awardeeCaption")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Event
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.event?.name}
                onChange={handleInputChange("event.name")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Event Location
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.event.location}
                onChange={handleInputChange("event.location")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Event Date
              </label>
              <input
                type="text"
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.event.date}
                onChange={handleInputChange("event.date")} // Updated onChange
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="text-gray-400">
                Message
              </label>
              <textarea
                className="p-2 bg-[#636363] rounded-lg text-white"
                value={selectedCertificate?.message}
                onChange={handleInputChange("message")} // Updated onChange
              ></textarea>
            </div>
          </div>
        );

      case "signature":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="signature-name" className="text-white">
                Name
              </label>
              <input
                type="text"
                id="signature-name"
                className="p-2 bg-[#636363] rounded-lg text-white"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="signature-position" className="text-white">
                Position
              </label>
              <input
                type="text"
                id="signature-position"
                className="p-2 bg-[#636363] rounded-lg text-white"
              />
            </div>
            <button className="text-white p-2 my-4 bg-[#332626] hover:bg-[#333232] rounded-lg shadow-lg flex items-center">
              <MdAddCircle className="mr-2" /> Add
            </button>
            <h1 className="text-white border-b border-[#636363]">
              Signatories
            </h1>
          </div>
        );
      case "branding":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="upload-logo" className="text-white">
                Upload Logo
              </label>
              <input
                type="file"
                id="upload-logo"
                className="p-2 bg-[#636363] rounded-lg text-white"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="upload-background" className="text-white">
                Upload Background Image
              </label>
              <input
                type="file"
                id="upload-background"
                className="p-2 bg-[#636363] rounded-lg text-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-[#ffeeee] min-h-screen h-full">
      <div className="h-full p-5 bg-[#3d3d3d] rounded-lg">
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab("information")}
            className={`py-2 px-4 ${
              activeTab === "information"
                ? "border-b-4 border-[#636363]"
                : "bg-[#3d3d3d]"
            } text-white text-xs`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("signature")}
            className={`py-2 px-4 ${
              activeTab === "signature"
                ? "border-b-4 border-[#636363]"
                : "bg-[#3d3d3d]"
            } text-white text-xs`}
          >
            Signature
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`py-2 px-4 ${
              activeTab === "branding"
                ? "border-b-4 border-[#636363]"
                : "bg-[#3d3d3d]"
            } text-white text-xs`}
          >
            Branding
          </button>
        </div>
        <div>{renderTabContent()}</div>
        {defaultCertificate &&
          selectedCertificate &&
          JSON.stringify(defaultCertificate) !==
            JSON.stringify(selectedCertificate) && (
            <button className="text-white p-2 my-4 bg-[#332626] hover:bg-[#333232] rounded-lg shadow-lg flex items-center">
              <MdSave className="mr-2" /> Save
            </button>
          )}
      </div>
    </div>
  );
};
