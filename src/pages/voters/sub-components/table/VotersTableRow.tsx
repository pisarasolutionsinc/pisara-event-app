import { IoIosArrowDown } from "react-icons/io";
import { calculateAge } from "../../../../utils/useMath";

interface VotersTableRowProps {
  voter: any; // Replace `any` with your Voter type
  expandedPage: boolean;
  expandedRows: string[];
  selectedVoter: any; // Replace `any` with your Voter type
  handleOpenExpandedPage: (voter: any) => void;
  toggleRow: (id: string, voter: any) => void;
  getInitials: (name: string) => string;
}

const VotersTableRow = ({
  voter,
  expandedPage,
  expandedRows,
  selectedVoter,
  handleOpenExpandedPage,
  toggleRow,
  getInitials,
}: VotersTableRowProps) => {
  return (
    <>
      <tr className="text-3xl sm:text-sm md:text-xs xl:text-ms ">
        <td
          onClick={() => handleOpenExpandedPage(voter)}
          className={`px-6 py-4 whitespace-nowrap hover:text-blue-600 cursor-pointer ${
            selectedVoter && selectedVoter._id === voter._id
              ? "text-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          {`${voter.name.firstname} ${voter.name.lastname}`}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap    text-gray-500 ${
            voter.role === "viewer" ? "text-gray-500" : "text-green-500"
          } ${expandedPage ? "hidden" : "hidden md:block  xl:block"}`}
        >
          {calculateAge(voter.birthday)}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap  text-gray-500 ${
            expandedPage ? "hidden" : ""
          }`}
        >
          {voter.sex.toUpperCase()}
        </td>

        <td
          className={`px-6 py-4 whitespace-nowrap  text-gray-500 ${
            voter.type === "member" ? "text-gray-500" : "text-green-500"
          } ${expandedPage ? "hidden" : ""}`}
        >
          {voter.type.toUpperCase()}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap  text-gray-500 ${
            voter.status === "inactive" ? "text-gray-500" : "text-green-500"
          } ${expandedPage ? "hidden" : ""}`}
        >
          {voter.status.toUpperCase()}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-gray-500 ${
            expandedPage ? "hidden" : ""
          }`}
        >
          <button
            onClick={() => toggleRow(voter._id, voter)}
            className="text-blue-500 hover:text-blue-700 flex justify-between items-center w-full"
          >
            <IoIosArrowDown
              size={20}
              className={`mx-auto ${
                expandedRows.includes(voter._id) ? "rotate-180" : ""
              }`}
            />
          </button>
        </td>
      </tr>
      {expandedRows.includes(voter._id) && !expandedPage && (
        <tr>
          <td colSpan={5} className="px-6 py-4">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-start space-x-5">
              {voter.photo ? (
                <img
                  src={voter.photo}
                  alt={`${voter.name.firstname} ${voter.name.lastname}`}
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-500 text-white text-2xl font-bold rounded-full">
                  {getInitials(
                    `${voter.name.firstname} ${voter.name.lastname}`
                  )}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  <span className="text-gray-600">Email:</span> {voter.email}
                </p>
                <p className="text-sm font-medium text-gray-800 mb-2">
                  <span className="text-gray-600">Contact:</span>{" "}
                  {voter.contact}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  <span className="text-gray-600">Address:</span>{" "}
                  {voter.address.length > 0 &&
                    `${voter.address[0].barangay}, ${voter.address[0].city}, ${voter.address[0].province}`}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default VotersTableRow;
