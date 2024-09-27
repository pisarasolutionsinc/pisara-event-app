// src/components/MapSidebar.tsx
import React, { useState } from "react";
import LocationSelector from "../filter/LocationSelector";
import { Person } from "../../model/personModel";
import { FaPeopleGroup } from "react-icons/fa6";

interface Barangay {
  id: number;
  name: string;
}

interface MapSidebarProps {
  citizenData: Person[];
  barangays: Barangay[];
  onBarangayClick: (barangay: Barangay) => void;
  onLocationChange: (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({
  citizenData,
  barangays,
  onBarangayClick,
  onLocationChange,
}) => {
  const [region, setRegion] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [municipality, setMunicipality] = useState<string | null>(null);
  const [barangay, setBarangay] = useState<string | null>(null);

  const getTotalPopulation = (barangay: string) => {
    const filteredCitizens = citizenData.filter(
      (person) =>
        person.address &&
        person.address.some((addr) => addr.barangay.includes(barangay))
    );
    return filteredCitizens.length;
  };

  const getTotalMunicipalityPopulation = (municipality: string) => {
    const filteredCitizens = citizenData.filter(
      (person) =>
        person.address &&
        person.address.some((addr) => addr.city.includes(municipality))
    );
    return filteredCitizens.length;
  };

  const getTotalProvincePopulation = (province: string) => {
    const filteredCitizens = citizenData.filter(
      (person) =>
        person.address &&
        person.address.some((addr) => addr.province.includes(province))
    );
    return filteredCitizens.length;
  };

  const handleLocationChange = (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => {
    setRegion(region);
    setProvince(province);
    setMunicipality(municipality);
    setBarangay(barangay);
    onLocationChange(region, province, municipality, barangay);
  };

  return (
    <div className="w-1/4 p-4 bg-white">
      <LocationSelector
        onLocationChange={handleLocationChange}
        showBarangay={false}
      />
      <div className="flex flex-col h-[60vh] overflow-hidden mt-4">
        <hr />
        <div className="text-xs font-semibold mb-2 text-gray-700 flex justify-between items-center py-2">
          <p>Barangays</p>
          <div className="flex items-center bg-gray-100 p-2 rounded-lg text-sm text-blue-500">
            <FaPeopleGroup size={23} className="mr-2" />
            <p>
              {province
                ? getTotalProvincePopulation(province)
                : province && municipality
                ? getTotalMunicipalityPopulation(municipality)
                : 0}
            </p>
          </div>
        </div>
        <hr />
        <div className="flex-1 overflow-y-auto">
          {barangays.map((barangay) => (
            <div key={barangay.id}>
              <button
                className="w-full text-sm flex items-center justify-between text-left p-2 border-b border-gray-300"
                onClick={() => onBarangayClick(barangay)}
              >
                <p>{barangay.name}</p>
                <div className="flex items-center bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
                  <FaPeopleGroup size={23} className="mr-2" />
                  <p>{getTotalPopulation(barangay.name)}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
        <span className="text-xs hidden font-semibold mb-2 text-gray-700">
          {region && region}, {province && province} ,{" "}
          {municipality && municipality} , {barangay && barangay}
        </span>
      </div>
    </div>
  );
};

export default MapSidebar;
