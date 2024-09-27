import { useEffect, useState } from "react";
import MapSubSidebar from "../../components/navigation/MapSubSidebar";
import Map from "../../components/props/Map";
import { Person } from "../../model/personModel";
import { LOCATION_MAP } from "../../config/locationConfig";
import MapSidebar from "../../components/navigation/MapSideNavigation";
import { usePerson } from "../../hooks/usePerson";

interface Barangay {
  id: number;
  name: string;
}

interface Municipality {
  Barangays?: string[]; // Update this based on your actual structure
}

const MapPage = () => {
  const { searchPerson } = usePerson();
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [citizens, setCitizens] = useState<Person[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  // Effect to filter citizens based on selected location
  useEffect(() => {
    const fetchCitizens = async () => {
      if (selectedRegion || selectedProvince || selectedMunicipality) {
        const filters = {
          region: selectedRegion,
          province: selectedProvince,
          city: selectedMunicipality,
        };

        const filteredCitizens: Person[] = await searchPerson("address", {
          $elemMatch: Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v)
          ),
        });

        // Ensure filteredCitizens is always an array
        setCitizens(Array.isArray(filteredCitizens) ? filteredCitizens : []);
      }
    };

    fetchCitizens();
  }, [selectedRegion, selectedProvince, selectedMunicipality, searchPerson]);

  // Effect to update barangays when location changes

  useEffect(() => {
    let barangays: any[] = [];

    if (selectedRegion && selectedProvince && selectedMunicipality) {
      const municipality = LOCATION_MAP[selectedRegion]?.Provinces[
        selectedProvince
      ]?.Municipalities[selectedMunicipality] as Municipality;

      barangays = municipality?.Barangays || [];
    } else if (selectedRegion && selectedProvince) {
      const municipalities =
        LOCATION_MAP[selectedRegion]?.Provinces[selectedProvince]
          ?.Municipalities;

      // Ensure municipalities is an object and extract barangays correctly
      if (municipalities && typeof municipalities === "object") {
        barangays = Object.values(municipalities).flatMap(
          (m: Municipality) => m.Barangays || []
        );
      }
    }

    setBarangays(
      barangays.map((b: string, index: number) => ({ id: index + 1, name: b }))
    );
  }, [selectedRegion, selectedProvince, selectedMunicipality]);

  const handleLocationChange = (
    region: string | null,
    province: string | null,
    municipality: string | null,
    barangay: string | null
  ) => {
    setSelectedRegion(region);
    setSelectedProvince(province);
    setSelectedMunicipality(municipality);
    setSelectedBarangay(barangay);
  };

  const handleBarangayClick = (barangay: string) => {
    setSelectedBarangay(barangay);
  };

  const handleCloseSubSidebar = () => {
    setSelectedBarangay(null);
  };

  return (
    <div className="flex h-[95vh]">
      <MapSidebar
        citizenData={citizens}
        barangays={barangays}
        onBarangayClick={(barangay) => {
          handleBarangayClick(barangay.name);
        }}
        onLocationChange={handleLocationChange}
      />
      {selectedBarangay && (
        <MapSubSidebar
          barangay={selectedBarangay}
          citizens={citizens}
          onClose={handleCloseSubSidebar}
        />
      )}
      <div className="flex-1">
        <Map
          selectedRegion={selectedRegion || ""}
          selectedProvince={selectedProvince || ""}
          selectedMunicipality={selectedMunicipality || ""}
          selectedBarangay={selectedBarangay || ""}
        />
      </div>
    </div>
  );
};

export default MapPage;
