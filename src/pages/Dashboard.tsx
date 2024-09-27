// import { Link } from "react-router-dom"
import { useState } from "react";
import FilterButton from "../components/buttons/FilterButton";
import TotalAndRankCard from "../components/cards/TotalAndRankCard";
import { LOCATION_MAP } from "../config/locationConfig";
import { LocationMap } from "../types/locationType";
import GeomapCard from "../components/cards/GeomapCard";

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<
    keyof LocationMap | "All"
  >("All");
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<string>("All");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("All");
  //  console.log(selectedBarangay);

  const center = [12.7385, 121.774];

  const regions = Object.keys(LOCATION_MAP);
  const provinces =
    selectedRegion !== "All"
      ? Object.keys(LOCATION_MAP[selectedRegion].Provinces || {})
      : [];
  const municipalities =
    selectedProvince !== "All"
      ? Object.keys(
          LOCATION_MAP[selectedRegion]?.Provinces[selectedProvince]
            ?.Municipalities || {}
        )
      : [];
  const barangays =
    selectedMunicipality !== "All"
      ? LOCATION_MAP[selectedRegion]?.Provinces[selectedProvince]
          ?.Municipalities[selectedMunicipality]?.Barangays || []
      : [];

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedProvince("All");
    setSelectedMunicipality("All");
    setSelectedBarangay("All");
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedMunicipality("All");
    setSelectedBarangay("All");
  };

  const handleMunicipalityChange = (municipality: string) => {
    setSelectedMunicipality(municipality);
    setSelectedBarangay("All");
  };

  const handleBarangayChange = (barangay: string) => {
    setSelectedBarangay(barangay);
  };

  return (
    <div className="p-5">
      <section className="pb-3 flex flex-row space-x-3 ">
        <FilterButton
          title={"Region"}
          defaultValue={"All"}
          applyFilter={handleRegionChange}
          options={["All", ...regions]}
        />
        <FilterButton
          title={"Province"}
          defaultValue={"All"}
          applyFilter={handleProvinceChange}
          options={["All", ...provinces]}
        />
        <FilterButton
          title={"Municipality"}
          defaultValue={"All"}
          applyFilter={handleMunicipalityChange}
          options={["All", ...municipalities]}
        />
        <FilterButton
          title={"Barangay"}
          defaultValue={"All"}
          applyFilter={handleBarangayChange}
          options={["All", ...barangays]}
        />
      </section>
      <section className="pb-3 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TotalAndRankCard
            title={"Voters"}
            count={123123123123}
            rows={[{ label: "", link: "#", count: 6 }]}
          />
          <TotalAndRankCard
            title={"Male"}
            count={56321314}
            rows={[{ label: "", link: "#", count: 6 }]}
          />
          <TotalAndRankCard
            title={"Female"}
            count={23663452}
            rows={[{ label: "", link: "#", count: 6 }]}
          />
        </div>
      </section>
      <section>
        <GeomapCard data={[]} center={center} zoom={5} />
      </section>
      <span className="text-gray-500 hidden">{selectedBarangay}</span>
    </div>
  );
};

export { Dashboard };
