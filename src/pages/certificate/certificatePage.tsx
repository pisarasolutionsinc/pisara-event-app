import { useEffect, useRef, useState } from "react";
import { usePerson } from "../../hooks/usePerson";
import { Person } from "../../model/personModel";
import { ASSET, TEMPLATE } from "../../config/assets";
import { useReactToPrint } from "react-to-print";
import { useEvent } from "../../hooks/useEvent";
import { useParams } from "react-router-dom";
import { PiPrinter } from "react-icons/pi";
import { BiDownload, BiShare } from "react-icons/bi";
import * as htmlToImage from "html-to-image";
import { CertificateCard } from "../../components/cards/CertificateCard";
import {
  CertificateLeftSideNavigation,
  CertificateRightSideNavigation,
} from "./../../components/navigation/CertificateSideNavigation";

export const CertificatePage = () => {
  const { getPerson, personId } = usePerson();
  const { getEvent } = useEvent();
  const [person, setPerson] = useState<Person | null>(null);
  const { eventId } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const selectedFields = [
    "_id",
    "name",
    "date",
    "organizer",
    "template.certificate",
  ];
  const populateFields = ["template.certificate"];
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(
    null
  );
  const [defaultCertificate, setDefaultCertificate] = useState<any | null>(
    null
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = async () => {
    if (componentRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(componentRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "id-card.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchPerson();
  }, [personId]);

  const fetchPerson = async () => {
    try {
      const result: any = await getPerson(personId ?? "");
      setPerson(result);
    } catch (error) {
      console.error("Error fetching person:", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const result = await getEvent(
        eventId as string,
        selectedFields,
        populateFields
      );
      setEvent(result);

      if (
        result?.template?.certificate &&
        result.template.certificate.length > 0
      ) {
        setSelectedCertificate(result.template.certificate[0]);
        setDefaultCertificate(result.template.certificate[0]);
      } else {
        setSelectedCertificate(""); // Set a default value if undefined
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share && componentRef.current) {
      htmlToImage
        .toPng(componentRef.current)
        .then((dataUrl) => {
          navigator.share({
            title: "ID Card",
            text: "Here is the ID card for the event.",
            files: [new File([dataUrl], "id-card.png", { type: "image/png" })],
          });
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleCertificateChange = (field: string, value: string) => {
    setSelectedCertificate((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-2">
        <CertificateLeftSideNavigation
          template={event?.template?.certificate}
        />
      </div>

      <div className="flex justify-center items-center h-screen col-span-7">
        <div>
          <div
            ref={componentRef}
            id="id-card"
            className="flex flex-col items-center"
          >
            <CertificateCard
              selectedCertificate={selectedCertificate}
              data={person}
              event={event}
              variant="1"
              backgroundPhoto={TEMPLATE.CERT.D1}
              logo={ASSET.LOGIN_LOGO}
              eventId={eventId}
            />
          </div>
          <div className="text-center flex justify-center items-center space-x-4">
            <button
              onClick={handlePrint}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
            >
              <PiPrinter size={20} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
            >
              <BiDownload size={20} /> Download
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
            >
              <BiShare size={20} /> Share
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-3">
        <CertificateRightSideNavigation
          person={person}
          defaultCertificate={defaultCertificate}
          selectedCertificate={selectedCertificate}
          onChange={handleCertificateChange}
        />
      </div>
    </div>
  );
};
