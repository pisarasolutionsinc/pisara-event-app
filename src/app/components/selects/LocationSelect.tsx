import React, { useEffect, useState } from "react";
import REGION from "../../../assets/json/ph/region.json";
import PROVINCE from "../../../assets/json/ph/province.json";
import CITY from "../../../assets/json/ph/city.json";
import BARANGAY from "../../../assets/json/ph/barangay.json";

interface Region {
  region_code: string;
  region_name: string;
}

interface Province {
  province_code: string;
  province_name: string;
  region_code: string;
}

interface City {
  city_code: string;
  city_name: string;
  province_code: string;
}

interface Barangay {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
}

// Accepts an onChange function as a prop
interface LocationSelectProps {
  onChange: (locationValue: {
    lat: string;
    lng: string;
    address: string;
    details: {
      region: string;
      province: string;
      city: string;
      barangay: string;
      street: string; // Add other fields as needed
      house_no: string;
      postal_code: string;
    };
  }) => void;
}

const regionData: Region[] = REGION as Region[];
const provinceData: Province[] = PROVINCE as Province[];
const cityData: City[] = CITY as City[];
const barangayData: Barangay[] = BARANGAY as Barangay[];

const LocationSelect: React.FC<LocationSelectProps> = ({ onChange }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Barangay[]>([]);

  useEffect(() => {
    const regionDropdown = document.getElementById(
      "region"
    ) as HTMLSelectElement;
    regionData.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.region_code;
      option.textContent = entry.region_name;
      regionDropdown.appendChild(option);
    });
  }, []);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regionCode = event.target.value;
    setSelectedRegion(regionCode);
    // Clear other selections
    setSelectedProvince("");
    setSelectedCity("");
    setBarangayOptions([]);
    setCityOptions([]);

    // Filter and set province options
    const filteredProvinces = provinceData.filter(
      (province) => province.region_code === regionCode
    );
    setProvinceOptions(filteredProvinces);
  };

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setSelectedCity("");
    setBarangayOptions([]);

    const filteredCities = cityData.filter(
      (city) => city.province_code === provinceCode
    );
    setCityOptions(filteredCities);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = event.target.value;
    setSelectedCity(cityCode);

    // Filter and set barangay options
    const filteredBarangays = barangayData.filter(
      (barangay) => barangay.city_code === cityCode
    );
    setBarangayOptions(filteredBarangays);
  };

  const handleBarangayChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const brgyCode = event.target.value;
    setSelectedBarangay(brgyCode);

    // Create the data object to pass
    const data = {
      lat: "", // Set this to the appropriate value if needed
      lng: "", // Set this to the appropriate value if needed
      address: `${selectedRegion}, ${selectedProvince}, ${selectedCity}, ${selectedBarangay}`, // Set this to the appropriate value if needed
      details: {
        region: selectedRegion,
        province: selectedProvince,
        city: selectedCity,
        barangay: brgyCode,
        street: "", // Add street information if available
        house_no: "", // Add house number if available
        postal_code: "", // Add postal code if available
      },
    };

    // Call onChange prop to pass the location data
    onChange(data);
  };

  return (
    <div className="bg-white mb-4">
      <h2 className="text-xs text-gray-400 px-1">Location</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          id="region"
          onChange={handleRegionChange}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="" disabled selected>
            Choose Region
          </option>
        </select>

        <select
          id="province"
          value={selectedProvince}
          onChange={handleProvinceChange}
          disabled={!selectedRegion}
          className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
            !selectedRegion ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="" disabled selected>
            Choose Province
          </option>
          {provinceOptions.map((province) => (
            <option key={province.province_code} value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>

        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedProvince}
          className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
            !selectedProvince ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="" disabled selected>
            Choose City/Municipality
          </option>
          {cityOptions.map((city) => (
            <option key={city.city_code} value={city.city_code}>
              {city.city_name}
            </option>
          ))}
        </select>

        <select
          id="barangay"
          disabled={!selectedCity}
          onChange={handleBarangayChange}
          className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
            !selectedCity ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="" disabled selected>
            Choose Barangay
          </option>
          {barangayOptions.map((barangay) => (
            <option key={barangay.brgy_code} value={barangay.brgy_code}>
              {barangay.brgy_name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden">{selectedBarangay}</div>
    </div>
  );
};

export default LocationSelect;
