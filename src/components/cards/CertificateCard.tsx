import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { twMerge } from "tailwind-merge";
import { useGeneral } from "../../hooks/useGeneral";

interface CertificateCardsProps {
  title?: string;
  value?: number | string;
  data?: any;
  event?: any;
  isDisplayData?: boolean;
  variant?: "default" | "custom" | "1";
  icon?: React.ReactNode;
  classParent?: string;
  classIcon?: string;
  classTitle?: string;
  classValue?: string;
  backgroundPhoto?: string;
  logo?: string;
  eventCategory?: string;
  eventId?: string;
  selectedCertificate?: any;
}

export const CertificateCard = ({
  data,
  event,
  isDisplayData = true,
  variant = "default",
  backgroundPhoto,
  classParent,
  logo,
  selectedCertificate,
}: CertificateCardsProps) => {
  const { getInitials } = useGeneral();
  const [isBrokenPhoto, setIsBrokenPhoto] = useState(false);

  useEffect(() => {
    setIsBrokenPhoto(false);
  }, [data]);
  // Define the different variants
  const variants = {
    default: () => (
      <div className="bg-white border rounded-lg p-6 max-w-sm my-6 mx-auto">
        <div className="items-center gap-6">
          <div className="flex justify-center">
            {data && data?.photo && !isBrokenPhoto ? (
              <img
                src={data?.photo}
                alt={`${data?.name?.firstname || ""} ${
                  data?.name?.lastname || ""
                }`}
                className="w-28 h-28 rounded-full border-4 border-gray-200 object-cover shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "";
                  setIsBrokenPhoto(true);
                }}
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center bg-blue-500 text-white text-3xl font-semibold rounded-full shadow-lg">
                {getInitials(
                  `${data?.name?.firstname || ""} ${data?.name?.lastname || ""}`
                )}
              </div>
            )}
          </div>

          <div className="text-gray-800 text-center">
            <p className="text-3xl font-bold mb-2">
              {data?.name?.firstname || ""} {data?.name?.lastname || ""}
            </p>
            <p className="font-bold mb-2">{data?.email}</p>
          </div>
          <div className="flex justify-center">
            <div className=" my-4 border-2 rounded-lg w-fit p-2">
              <QRCode
                value={"ID-" + data?.customId + "-customId" || ""}
                size={150}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    custom: () => (
      <div className="bg-white border rounded-lg p-6 max-w-sm my-6 mx-auto">
        <div className="items-center gap-6">
          {isDisplayData && (
            <>
              <div className="flex justify-center">
                {data && data?.photo && !isBrokenPhoto ? (
                  <img
                    src={data?.photo}
                    alt={`${data?.name?.firstname || ""} ${
                      data?.name?.lastname || ""
                    }`}
                    className="w-28 h-28 rounded-full border-4 border-gray-200 object-cover shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      setIsBrokenPhoto(true);
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center bg-blue-500 text-white text-3xl font-semibold rounded-full shadow-lg">
                    {getInitials(
                      `${data?.name?.firstname || ""} ${
                        data?.name?.lastname || ""
                      }`
                    )}
                  </div>
                )}
              </div>

              <div className="text-gray-800 text-center">
                <p className="text-3xl font-bold mb-2">
                  {data?.name?.firstname || ""} {data?.name?.lastname || ""}
                </p>
                <p className="font-bold mb-2">{data?.email}</p>
              </div>
            </>
          )}
          <div className="flex justify-center">
            <div className=" my-4 border-2 rounded-lg w-fit p-2">
              <QRCode
                value={"ID-" + data?.customId + "-customId" || ""}
                size={150}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    1: () => (
      <div
        className={twMerge(
          `bg-white border rounded-lg my-6 mx-auto h-[700px] w-[1000px] relative`,
          classParent
        )}
        style={{
          backgroundImage: `url(${backgroundPhoto})`,
          backgroundSize: "cover", // Ensure the image covers the div
          backgroundPosition: "center", // Center the background image
        }}
      >
        <div>
          <img src={logo} alt="" className="w-16 h-16 m-4" />
        </div>
        <div className="items-center gap-6 px-5">
          <div className="text-green-800 text-center mt-4">
            <h1 className="text-3xl font-bold mb-2">
              {selectedCertificate?.title ? selectedCertificate?.title : ""}
            </h1>
            <p className="text-gray-500 mb-4">
              {selectedCertificate?.titleCaption
                ? selectedCertificate?.titleCaption
                : ""}
            </p>
            <p className="text-6xl font-bold mb-2 capitalize">
              {data?.name?.firstname || ""} {data?.name?.lastname || ""}
            </p>
            <div className="flex justify-center">
              <p className="text-gray-500 mb-2 text-wrap">
                {selectedCertificate?.awardeeCaption
                  ? selectedCertificate?.awardeeCaption
                  : ""}
              </p>
            </div>

            <p className="font-bold mb-5 capitalize">{event?.name}</p>
            <p className="text-gray-500 mb-2">Held on</p>
            <p className="font-bold">
              {new Date(event?.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="text-gray-500 mb-2 text-center text-wrap w-3/4 mx-auto">
              {selectedCertificate?.message ? selectedCertificate?.message : ""}
            </p>
          </div>
        </div>
        <div className="absolute bottom-5 w-full flex justify-between px-5">
          <div>
            <p className="text-gray-500 ">Presented by</p>
            <p className="font-bold text-green-800">{event?.organizer}</p>
            <p className="text-gray-500 ">Date of Issuance:</p>
            <p className="font-bold text-green-800">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="my-4 border-2 bg-white rounded-lg w-fit p-2">
            <QRCode value={event?._id + "-" + data?._id} size={50} />
          </div>
        </div>
      </div>
    ),
  };

  // Render the variant based on the variant prop
  const Component = variants[variant];

  return <Component />;
};
