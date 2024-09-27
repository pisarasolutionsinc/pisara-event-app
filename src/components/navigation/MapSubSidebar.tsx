import { FaTimes } from "react-icons/fa";
import { Person } from "../../model/personModel";
import { PiPerson } from "react-icons/pi";
import { BiSolidShield } from "react-icons/bi";

interface SubSidebarProps {
  barangay: string;
  citizens: Person[];
  onClose: () => void;
}

const MapSubSidebar = ({ barangay, citizens, onClose }: SubSidebarProps) => {
  const getTotalPopulation = (barangay: string) => {
    return citizens.filter(
      (person) =>
        person.address &&
        person.address.some((addr) => addr.barangay.includes(barangay))
    );
  };

  // Sort citizens to place Leaders at the top
  const sortedCitizens = getTotalPopulation(barangay).sort((a, b) => {
    if (a.type === "leader" && b.type !== "leader") return -1;
    if (a.type !== "leader" && b.type === "leader") return 1;
    return 0; // Keep original order for others
  });

  return (
    <div className="w-1/4 p-4 bg-white relative m-1">
      <button className="absolute top-2 right-2" onClick={onClose}>
        <FaTimes size={20} />
      </button>
      <h2 className="text-sm font-bold mb-4">Barangay {barangay}</h2>
      <div>
        {sortedCitizens.map((citizen) => (
          <div
            key={citizen._id}
            className="mb-2 px-4 py-1 text-sm rounded-md flex items-center"
          >
            {citizen.type === "leader" ? (
              <>
                <BiSolidShield className="inline mr-2 text-yellow-500" />
              </>
            ) : (
              <>
                <PiPerson className="inline mr-2 text-blue-500" />
              </>
            )}
            <p className="text-black/80">
              {citizen.name.prefix} {citizen.name.firstname}{" "}
              {citizen.name.middlename} {citizen.name.lastname}{" "}
              {citizen.name.suffix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapSubSidebar;
