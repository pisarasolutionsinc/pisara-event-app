import { FaPeopleGroup } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { usePerson } from "../../hooks/usePerson";
import { PiPlusCircle } from "react-icons/pi";
import { IoCloseCircle } from "react-icons/io5";

interface Barangay {
  id: number;
  name: string;
}

interface BrgyListCardProps {
  barangays: Barangay[];
  onBarangayClick: (barangay: Barangay) => void;
  selectedBarangays: Barangay[];
  municipality: string | null;
  province: string | null;
  totalCitizens: number; // New prop for total citizens
  totalSelectedCitizens: number; // New prop for total selected citizens
}

const BrgyListCard = ({
  barangays,
  onBarangayClick,
  selectedBarangays,
  municipality,
  province,
  totalSelectedCitizens, // Get total selected citizens
}: BrgyListCardProps) => {
  const [barangayPopulation, setBarangayPopulation] = useState<
    Record<string, number>
  >({});
  const [totalMunicipalityPopulation, setTotalMunicipalityPopulation] =
    useState<number>(0);
  const { countPerson } = usePerson();

  useEffect(() => {
    const fetchCounts = async () => {
      const barangayCounts = await Promise.all(
        barangays.map(async (barangay) => {
          const query = {
            $elemMatch: {
              province: province,
              city: municipality,
              barangay: barangay.name,
            },
          };
          return await countPerson("address", query);
        })
      );

      const municipalityQuery = {
        $elemMatch: {
          province: "Metro Manila",
          city: municipality,
        },
      };

      const municipalityCount = municipality
        ? await countPerson("address", municipalityQuery)
        : 0;

      // Process and set your state with counts
      const newBarangayPopulation: Record<string, number> = {};
      barangays.forEach((barangay, index) => {
        newBarangayPopulation[barangay.name] = barangayCounts[index];
      });

      setBarangayPopulation(newBarangayPopulation);
      setTotalMunicipalityPopulation(municipalityCount);
    };

    fetchCounts();
  }, [barangays, municipality, countPerson]);

  return (
    <div className=" overflow-y-hidden ">
      <div className="mb-2">
        <h1 className="text-lg font-bold  text-gray-500">
          {municipality + ", " + province}
        </h1>
        <span className="text-sm  gap-2 text-gray-400">
          {totalMunicipalityPopulation || 0} Total Population
        </span>
      </div>
      <div className="  mt-2  overflow-y-auto h-[70.5vh] pr-2">
        {barangays.map((barangay) => (
          <div
            key={barangay.id}
            onClick={() => onBarangayClick(barangay)}
            className={`flex justify-between items-center p-2 border hover:bg-green-50 hover:border-green-300  rounded cursor-pointer mb-1   ${
              selectedBarangays.find((b) => b.name === barangay.name)
                ? "bg-green-100 border-green-500"
                : ""
            }`}
          >
            <div className="flex justify-center items-center gap-2">
              <span
                className={`text-sm flex justify-center  items-center gap-2 ${
                  selectedBarangays.find((b) => b.name === barangay.name)
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                } rounded p-1 `}
              >
                {barangayPopulation[barangay.name] || 0} <FaPeopleGroup />
              </span>{" "}
              <span className="text-sm">{barangay.name}</span>
            </div>

            <div className="flex ">
              {selectedBarangays.find((b) => b.name === barangay.name) ? (
                <IoCloseCircle className="text-red-500" />
              ) : (
                <PiPlusCircle className="text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-end text-gray-500 p-4">
        <span className="font-bold mr-2">Total Selected Attendee(s):</span>{" "}
        {totalSelectedCitizens}
      </p>{" "}
    </div>
  );
};

export default BrgyListCard;
