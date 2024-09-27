import React, { useState, useEffect } from "react";
import { LOCATION_MAP } from "../../config/locationConfig";

interface LocationPickerProps {
  onLocationChange: (
    region: string | null,
    province: string | null,
    city: string | null,
    barangay: string | null
  ) => void;
  showRegion?: boolean;
  showProvince?: boolean;
  showMunicipality?: boolean;
  showBarangay?: boolean;
  variant?: "default" | "compact" | "grid" | "grid2";
  defaultLocation?: {
    region: string | null;
    province: string | null;
    city: string | null;
    barangay: string | null;
  };
}

const LocationPicker = ({
  onLocationChange,
  showRegion = true,
  showProvince = true,
  showMunicipality = true,
  showBarangay = true,
  variant = "default",
  defaultLocation = {
    region: null,
    province: null,
    city: null,
    barangay: null,
  },
}: LocationPickerProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    defaultLocation.region
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    defaultLocation.province
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(defaultLocation.city);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(
    defaultLocation.barangay
  );

  console.log({ selectedRegion, selectedProvince, selectedMunicipality });

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

  // Trigger onLocationChange when default values are loaded
  useEffect(() => {
    onLocationChange(
      selectedRegion,
      selectedProvince,
      selectedMunicipality,
      selectedBarangay
    );
  }, [
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
    selectedBarangay,
  ]);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const region = event.target.value || null;
    setSelectedRegion(region);
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    setSelectedBarangay(null);
    onLocationChange(region, null, null, null);
  };

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const province = event.target.value || null;
    setSelectedProvince(province);
    setSelectedMunicipality(null);
    setSelectedBarangay(null);
    onLocationChange(selectedRegion, province, null, null);
  };

  const handleMunicipalityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const municipality = event.target.value || null;
    setSelectedMunicipality(municipality);
    setSelectedBarangay(null);
    onLocationChange(selectedRegion, selectedProvince, municipality, null);
  };

  const handleBarangayChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const barangay = event.target.value || null;
    setSelectedBarangay(barangay);
    onLocationChange(
      selectedRegion,
      selectedProvince,
      selectedMunicipality,
      barangay
    );
  };

  // Default variant (stacked)
  const DefaultVariant = () => (
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
            value={selectedRegion || ""}
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
            value={selectedProvince || ""}
            onChange={handleProvinceChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
            value={selectedMunicipality || ""}
            onChange={handleMunicipalityChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
            value={selectedBarangay || ""}
            onChange={handleBarangayChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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

  // Compact variant (flex)
  const CompactVariant = () => (
    <div className="flex flex-wrap space-x-4 mb-4">
      {showRegion && (
        <select
          value={selectedRegion || ""}
          onChange={handleRegionChange}
          className="border rounded-lg py-2 px-4 mb-2"
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      )}
      {showProvince && selectedRegion && (
        <select
          value={selectedProvince || ""}
          onChange={handleProvinceChange}
          className="border rounded-lg py-2 px-4 mb-2"
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      )}
      {showMunicipality && selectedProvince && (
        <select
          value={selectedMunicipality || ""}
          onChange={handleMunicipalityChange}
          className="border rounded-lg py-2 px-4 mb-2"
        >
          <option value="">Select City</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      )}
      {showBarangay && selectedMunicipality && (
        <select
          value={selectedBarangay || ""}
          onChange={handleBarangayChange}
          className="border rounded-lg py-2 px-4 mb-2"
        >
          <option value="">Select Barangay</option>
          {barangays.map((barangay) => (
            <option key={barangay} value={barangay}>
              {barangay}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  const GridVariant = () => (
    <div className="grid grid-cols-4 gap-2">
      <select
        value={selectedRegion || ""}
        onChange={handleRegionChange}
        className={`border rounded-lg py-2 px-4 mb-2 ${
          selectedRegion === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select Region
        </option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <select
        value={selectedProvince || ""}
        onChange={handleProvinceChange}
        className={`border rounded-lg py-2 px-4 mb-2 ${
          selectedProvince === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select Province
        </option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      <select
        value={selectedMunicipality || ""}
        onChange={handleMunicipalityChange}
        className={`border rounded-lg py-2 px-4 mb-2 ${
          selectedMunicipality === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select City
        </option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>

      <select
        value={selectedBarangay || ""}
        onChange={handleBarangayChange}
        className={`border rounded-lg py-2 px-4 mb-2 ${
          selectedBarangay === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="">Select Barangay</option>
        {barangays.map((barangay) => (
          <option key={barangay} value={barangay}>
            {barangay}
          </option>
        ))}
      </select>
    </div>
  );

  const DisableAndEnabledGridVariant = () => (
    <div className="grid grid-cols-4 gap-2">
      <select
        value={selectedRegion || ""}
        onChange={handleRegionChange}
        className={`focus:border focus:rounded-lg py-2 px-4 mb-2 ${
          selectedRegion === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select Region
        </option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <select
        value={selectedProvince || ""}
        onChange={handleProvinceChange}
        className={`focus:border focus:rounded-lg py-2 px-4 mb-2 ${
          selectedProvince === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select Province
        </option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      <select
        value={selectedMunicipality || ""}
        onChange={handleMunicipalityChange}
        className={`focus:border rounded-lg py-2 px-4 mb-2 ${
          selectedMunicipality === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="" className="text-gray-400">
          Select City
        </option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>

      <select
        value={selectedBarangay || ""}
        onChange={handleBarangayChange}
        className={`focus:border rounded-lg py-2 px-4 mb-2 ${
          selectedBarangay === "" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option value="">Select Barangay</option>
        {barangays.map((barangay) => (
          <option key={barangay} value={barangay}>
            {barangay}
          </option>
        ))}
      </select>
    </div>
  );

  return variant === "compact" ? (
    <CompactVariant />
  ) : variant === "grid" ? (
    <GridVariant />
  ) : variant === "grid2" ? (
    <DisableAndEnabledGridVariant />
  ) : (
    <DefaultVariant />
  );
};

export default LocationPicker;
