// src/components/props/LocationSelector.tsx
import React, { useState } from "react";
import { LOCATION_MAP } from "../../config/locationConfig";

interface LocationSelectorProps {
  onLocationChange: (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => void;
  showRegion?: boolean;
  showProvince?: boolean;
  showMunicipality?: boolean;
  showBarangay?: boolean;
}

const LocationSelector = ({
  onLocationChange,
  showRegion = true,
  showProvince = true,
  showMunicipality = true,
  showBarangay = true,
}: LocationSelectorProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  // Ensure the selectedRegion is not null before using it as an index
  const regions = Object.keys(LOCATION_MAP) as string[];
  const provinces = selectedRegion
    ? Object.keys(LOCATION_MAP[selectedRegion]?.Provinces || {})
    : [];
  const municipalities = selectedProvince
    ? Object.keys(
        LOCATION_MAP[selectedRegion!]?.Provinces[selectedProvince]
          ?.Municipalities || {}
      )
    : [];
  const barangays = selectedMunicipality
    ? LOCATION_MAP[selectedRegion!]?.Provinces[selectedProvince!]
        ?.Municipalities[selectedMunicipality]?.Barangays || []
    : [];

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const region = event.target.value;
    setSelectedRegion(region || null);
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    setSelectedBarangay(null);
    onLocationChange(region || null, null, null, null);
  };

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const province = event.target.value;
    setSelectedProvince(province || null);
    setSelectedMunicipality(null);
    setSelectedBarangay(null);
    onLocationChange(selectedRegion, province || null, null, null);
  };

  const handleMunicipalityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const municipality = event.target.value;
    setSelectedMunicipality(municipality || null);
    setSelectedBarangay(null);
    onLocationChange(
      selectedRegion,
      selectedProvince,
      municipality || null,
      null
    );
  };

  const handleBarangayChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBarangay(event.target.value || null);
    onLocationChange(
      selectedRegion,
      selectedProvince,
      selectedMunicipality,
      event.target.value || null
    );
  };

  return (
    <div className="space-y-5">
      {showRegion && (
        <div>
          <label
            htmlFor="region"
            className="block text-xs font-medium text-gray-700"
          >
            Region
          </label>
          <select
            id="region"
            value={selectedRegion ?? ""}
            onChange={handleRegionChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      )}

      {showProvince && selectedRegion && (
        <div>
          <label
            htmlFor="province"
            className="block text-xs font-medium text-gray-700"
          >
            Province
          </label>
          <select
            id="province"
            value={selectedProvince ?? ""}
            onChange={handleProvinceChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={!showRegion}
          >
            <option value="">All</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
      )}

      {showMunicipality && selectedProvince && (
        <div>
          <label
            htmlFor="municipality"
            className="block text-xs font-medium text-gray-700"
          >
            Municipality
          </label>
          <select
            id="municipality"
            value={selectedMunicipality ?? ""}
            onChange={handleMunicipalityChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={!showProvince}
          >
            <option value="">All</option>
            {municipalities.map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </div>
      )}

      {showBarangay && selectedMunicipality && (
        <div>
          <label
            htmlFor="barangay"
            className="block text-xs font-medium text-gray-700"
          >
            Barangay
          </label>
          <select
            id="barangay"
            value={selectedBarangay ?? ""}
            onChange={handleBarangayChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={!showMunicipality}
          >
            <option value="">All</option>
            {barangays.map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
