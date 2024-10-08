import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { twMerge } from "tailwind-merge";
import { useGeneral } from "../../hooks/useGeneral";
import { TEMPLATE } from "../../config/assets";

interface IdCardsProps {
  title?: string;
  value?: number | string;
  data?: any;
  isDisplayData?: boolean;
  variant?: "default" | "custom" | "1" | "2" | "3";
  icon?: React.ReactNode;
  classParent?: string;
  classIcon?: string;
  classTitle?: string;
  classValue?: string;
  backgroundPhoto?: string;
  logo?: string;
  eventCategory?: string;
  eventName?: string;
  eventId?: string;
}

export const IdCard = ({
  data,
  isDisplayData = true,
  variant = "default",
  backgroundPhoto,
  classParent,
  logo,
  eventCategory,
  eventName,
  eventId,
}: IdCardsProps) => {
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
      <div>
        <div
          className={twMerge(
            `"bg-white border rounded-lg max-w-[23rem] my-6 mx-auto"`,
            classParent
          )}
          style={{
            backgroundImage: `url(${TEMPLATE.CERT.D1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between">
            <img src={logo} alt="" className="w-16 h-16 m-4" />
            {/* <div className="flex justify-center">
              <img src={ASSET.LOGIN_LOGO_2} alt="" className="w-16 h-16 m-4" />

              <img
                src={ASSET.BAGONG_PILIPINAS_LOGO}
                alt=""
                className="w-16 h-16 m-4"
              />
            </div> */}
          </div>
          <div className="items-center gap-6 px-5">
            <div className="flex justify-center mt-10">
              {data && data?.photo && !isBrokenPhoto ? (
                <img
                  src={data?.photo}
                  alt={`${data?.name?.firstname} ${data?.name?.lastname}`}
                  className="w-28 h-28 rounded-full border-4  border-gray-200 object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    setIsBrokenPhoto(true);
                  }}
                />
              ) : (
                <div className="w-28 h-28 flex uppercase items-center justify-center bg-blue-500 text-white text-3xl font-semibold rounded-full shadow-lg">
                  {getInitials(
                    `${data?.name?.firstname} ${data?.name?.lastname}`
                  )}
                </div>
              )}
            </div>

            <div className="text-gray-800 text-center mt-4">
              <p className="text-3xl font-bold mb-2 capitalize">
                {data?.name?.firstname || ""} {data?.name?.lastname || ""}
              </p>
              {/* <p className="font-bold mb-2">{data?.email}</p> */}
            </div>
            <div className="text-gray-800 text-center ">
              <p className="text-sm uppercase font-semibold text-gray-400 mt-4">
                Organization
              </p>
              <p className="text-xl font-bold text-gray-800 capitalize">
                {data?.organization}
              </p>
              <p className="text-sm uppercase font-semibold text-gray-400 mt-4">
                Occupation
              </p>
              <p className="text-xl font-bold text-gray-800  capitalize">
                {data?.occupation}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <div className="my-4 border-2 bg-white rounded-lg w-fit p-2">
                <QRCode
                  value={"ID-" + data?.customId + "-customId" || ""}
                  size={50}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    2: () => (
      <div
        className={twMerge(
          `"bg-white border rounded-lg max-w-sm my-6 mx-auto"`,
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
          <div className="flex justify-center ">
            {data && data?.photo && !isBrokenPhoto ? (
              <img
                src={data?.photo}
                alt={`${data?.name?.firstname} ${data?.name?.lastname}`}
                className="w-28 h-28 rounded-full border-4  border-gray-200 object-cover shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "";
                  setIsBrokenPhoto(true);
                }}
              />
            ) : (
              <div className="w-28 h-28 flex uppercase items-center justify-center bg-blue-500 text-white text-3xl font-semibold rounded-full shadow-lg">
                {getInitials(
                  `${data?.name?.firstname} ${data?.name?.lastname}`
                )}
              </div>
            )}
          </div>

          <div className="text-gray-800 text-center mt-4">
            <p className="text-3xl font-bold mb-2 capitalize">
              {data?.name?.firstname || ""} {data?.name?.lastname || ""}
            </p>
            <p className="font-bold mb-2">{data?.email}</p>
            <p className="text-sm">{data?.organization}</p>
          </div>
          <div className="flex justify-center">
            <div className="my-4 border-2 bg-white rounded-lg w-fit p-2">
              <QRCode
                value={"ID-" + data?.customId + "-customId" || ""}
                size={150}
              />
            </div>
          </div>
          {eventId && (
            <div className="text-center mt-4 ">
              <p className="text-gray-800 text-center text-sm">
                {eventCategory || ""}
              </p>
              <p className="text-gray-800 text-center text-sm font-semibold">
                {eventName || ""}
              </p>
            </div>
          )}
        </div>
      </div>
    ),
    3: () => (
      <div
        className={twMerge(
          `"bg-white border rounded-lg max-w-[26rem] my-6 mx-auto"`,
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
          <div className="flex justify-center ">
            {data && data?.photo && !isBrokenPhoto ? (
              <img
                src={data?.photo}
                alt={`${data?.name?.firstname} ${data?.name?.lastname}`}
                className="w-28 h-28 rounded-full border-4  border-gray-200 object-cover shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "";
                  setIsBrokenPhoto(true);
                }}
              />
            ) : (
              <div className="w-28 h-28 flex uppercase items-center justify-center bg-blue-500 text-white text-3xl font-semibold rounded-full shadow-lg">
                {getInitials(
                  `${data?.name?.firstname} ${data?.name?.lastname}`
                )}
              </div>
            )}
          </div>

          <div className="text-gray-800 text-center mt-4">
            <p className="text-3xl font-bold mb-2 capitalize">
              {data?.name?.firstname || ""} {data?.name?.lastname || ""}
            </p>
            {/* <p className="font-bold mb-2">{data?.email}</p> */}
          </div>
          <div className="text-gray-800 text-center ">
            <p className="text-xs uppercase font-semibold text-gray-400 mt-2">
              Organization
            </p>
            <p className="text-lg font-bold text-gray-800 capitalize">
              {data?.organization}
            </p>
            <p className="text-xs uppercase font-semibold text-gray-400 mt-2">
              Occupation
            </p>
            <p className="text-lg font-bold text-gray-800 capitalize">
              {data?.occupation}
            </p>
          </div>

          {eventId && (
            <div className="text-center mt-8 ">
              <p className="text-xs uppercase font-semibold text-gray-400 mt-2 ">
                {eventCategory || ""}
              </p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {eventName || ""}
              </p>
            </div>
          )}
          <div className="flex justify-center">
            <div className="my-4 border-2 bg-white rounded-lg w-fit p-2">
              <QRCode
                value={"ID-" + data?.customId + "-customId" || ""}
                size={50}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  };

  // Render the variant based on the variant prop
  const Component = variants[variant];

  return <Component />;
};
