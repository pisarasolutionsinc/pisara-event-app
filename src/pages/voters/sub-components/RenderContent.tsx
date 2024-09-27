// renderContent.tsx
import { useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { useGeneral } from "../../../hooks/useGeneral";
import { Person } from "../../../model/personModel";
import { IdCard } from "../../../components/cards/IdCard";

const renderContent = (
  activeTab: string,
  selectedVoter: Person
): JSX.Element | null => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { getInitials } = useGeneral();

  switch (activeTab) {
    case "Details":
      return (
        <>
          <div className="flex gap-4">
            <div>
              {selectedVoter?.photo ? (
                <img
                  src={selectedVoter.photo}
                  alt={`${selectedVoter.name.firstname} ${selectedVoter.name.lastname}`}
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-500 text-white text-2xl font-bold rounded-full">
                  {getInitials(
                    `${selectedVoter.name.firstname} ${selectedVoter.name.lastname}`
                  )}
                </div>
              )}
            </div>

            <div>
              <p>
                <strong>ID:</strong> {selectedVoter._id}
              </p>
              <p>
                <strong>Email:</strong> {selectedVoter.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedVoter.contact}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {selectedVoter.address &&
                  selectedVoter.address
                    .map((address) =>
                      [address.text, address.city, address.province]
                        .filter(Boolean)
                        .join(", ")
                    )
                    .join("; ")}
              </p>
            </div>
          </div>
        </>
      );
    case "Generated ID":
      return (
        <div>
          <div ref={componentRef} id="qr-code" className="">
            <IdCard
              data={selectedVoter}
              variant="custom"
              isDisplayData={false}
            />
          </div>
          <div className="text-center my-4">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Print
            </button>
          </div>
        </div>
      );

    case "History":
      return <div>{/* Add history content here */}</div>;
    case "Event":
      return <div>{/* Add event content here */}</div>;
    default:
      return null;
  }
};

export default renderContent;
