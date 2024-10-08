import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FaFemale, FaMale, FaSearch, FaUser } from "react-icons/fa";
import { BiExport, BiImport } from "react-icons/bi";
import { Person } from "../../../model/personModel";
import LocationPicker from "../../../components/filter/LocationPicker";
import { StatCard } from "../../../components/cards/StatCard";
import VotersTableContainer from "./table/VoterTableContainer";
import VoterDetail from "./voter-details/VoterDetails";
import { useGeneral } from "../../../hooks/useGeneral";
import VoterDrawer from "../../../components/drawer/VoterDrawer";
import { usePerson } from "../../../hooks/usePerson";
import { useReport } from "../../../hooks/useReport";
import AddVotersByFileDrawer from "../../../components/drawer/AddVotersByFile";

const Dashboard = () => {
  const { getPersons } = usePerson(); // Destructure totalVoters
  const { fetchReports, report } = useReport();
  const { getInitials } = useGeneral();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [expandedPage, setExpandedPage] = useState<boolean>(false);
  const [selectedVoter, setSelectedVoter] = useState<Person>({} as Person);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [person, setPerson] = useState<Person[]>([]);
  const limit = 10;

  useEffect(() => {
    fetchPersons();
    fetchReports && fetchReports();
  }, [page, limit]);

  const fetchPersons = async () => {
    try {
      const response = await getPersons(page, limit);
      setPerson(response as Person[]);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const handleNextPageChange = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getPersons(nextPage, limit);
      return nextPage;
    });
  };

  const handlePreviousPageChange = () => {
    setPage((prevPage) => {
      const previousPage = prevPage - 1;
      getPersons(previousPage, limit);
      return previousPage;
    });
  };

  // Function to filter voters based on search and location criteria
  const filterVoters = () => {
    if (!Array.isArray(person)) return [];
    return person.filter((person) => {
      const matchesSearch =
        person.name?.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        person.name?.lastname.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        person.address &&
        person.address.some((addr) => {
          const matchesRegion =
            !selectedRegion || addr.region === selectedRegion;
          const matchesProvince =
            !selectedProvince || addr.province === selectedProvince;
          const matchesCity = !selectedCity || addr.city === selectedCity;
          const matchesBarangay =
            !selectedBarangay || addr.barangay === selectedBarangay;

          return (
            matchesRegion && matchesProvince && matchesCity && matchesBarangay
          );
        });

      return matchesSearch && matchesLocation;
    });
  };

  const filteredVoters = filterVoters();

  const handleImportClick = () => {
    setIsModalOpen(true);
  };

  const handleLocationChange = (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => {
    setSelectedRegion(region || "");
    setSelectedProvince(province || "");
    setSelectedCity(municipality || "");
    setSelectedBarangay(barangay || "");
  };

  const totalMale = filteredVoters.filter(
    (voter) => voter.sex === "male"
  ).length;
  const totalFemale = filteredVoters.filter(
    (voter) => voter.sex === "female"
  ).length;

  const toggleRow = (id: string, data: Person) => {
    setExpandedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      }
      return [id];
    });
    setSelectedVoter(data);
  };

  const handleOpenExpandedPage = (data: Person) => {
    setExpandedPage(true);
    setSelectedVoter(data);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil((report?.person?.totalVoter || 0) / limit);

  return (
    <div className="container mx-auto p-5">
      {!expandedPage && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="TOTAL VOTERS"
              value={report && report?.person ? report?.person?.totalVoter : 0}
              variant="design2"
              icon={<FaUser />}
              classIcon="text-green-300 bg-green-100"
              classParent="shadow-sm border"
            />
            <StatCard
              title="MALE"
              value={totalMale}
              variant="design2"
              icon={<FaMale />}
              classIcon="text-blue-300 bg-blue-100"
              classParent="shadow-sm border"
            />
            <StatCard
              title="FEMALE"
              value={totalFemale}
              variant="design2"
              icon={<FaFemale />}
              classIcon="text-pink-300 bg-pink-100"
              classParent="shadow-sm border"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center mb-4">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg py-2 px-4 w-full"
              />
            </div>
            <LocationPicker
              onLocationChange={handleLocationChange}
              variant="compact"
            />
          </div>
        </div>
      )}

      <div
        className={`bg-white p-4 rounded-lg shadow-md ${
          expandedPage ? "grid grid-cols-10" : ""
        }`}
      >
        <div className={`${expandedPage ? "col-span-3" : ""}`}>
          <div className="flex justify-between mb-4 mx-4">
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => setIsDrawerOpen(true)}
            >
              <IoMdAddCircle size={20} className="mr-2" />
              Add Voter
            </button>

            {!expandedPage && (
              <div className="flex gap-4">
                <button
                  className="text-blue-500 hover:bg-blue-700 hover:text-white flex items-center border-2 border-blue-500 py-1 px-4 font-semibold rounded-md"
                  onClick={handleImportClick}
                >
                  <BiImport size={20} className="mr-2" />
                  Import
                </button>
                <button className="text-blue-500 hover:bg-blue-700 hover:text-white  flex items-center border-2 border-blue-500 py-1 px-4 font-semibold rounded-md">
                  <BiExport size={20} className="mr-2" />
                  Export
                </button>
                {isModalOpen && (
                  <AddVotersByFileDrawer
                    isDrawerOpen={isModalOpen}
                    setIsDrawerOpen={setIsModalOpen}
                  />
                )}
              </div>
            )}
          </div>
          <VoterDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
          {expandedPage && (
            <div className="flex items-center mb-4 mx-4">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg py-2 px-4 w-full"
              />
            </div>
          )}
          <VotersTableContainer
            voters={filteredVoters}
            expandedPage={expandedPage}
            expandedRows={expandedRows}
            selectedVoter={selectedVoter}
            handleOpenExpandedPage={handleOpenExpandedPage}
            toggleRow={toggleRow}
            getInitials={getInitials}
          />
        </div>

        {expandedPage && (
          <VoterDetail
            selectedVoter={selectedVoter}
            setExpandedPage={setExpandedPage}
          />
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handlePreviousPageChange}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md mx-2 bg-gray-200 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPageChange}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md mx-2 bg-gray-200 disabled:bg-gray-300 "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
