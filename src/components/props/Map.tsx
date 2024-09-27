import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet's CSS is included

// Define the type for the props
interface MapProps {
  selectedRegion: string;
  selectedProvince: string;
  selectedMunicipality: string;
  selectedBarangay: string;
}

// Custom component to update the map view
const UpdateMapView: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map = ({
  selectedRegion,
  selectedProvince,
  selectedMunicipality,
  selectedBarangay,
}: MapProps) => {
  const [mapConfig, setMapConfig] = useState({
    center: [0, 0] as [number, number],
    zoom: 2,
  });
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchCoordinates = async (location: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: location,
            format: "json",
            addressdetails: 1,
            limit: 1,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  };

  useEffect(() => {
    const updateMapLocation = async () => {
      try {
        let location = selectedRegion;
        let zoomLevel = 8; // Default zoom level

        if (selectedBarangay) {
          location =
            selectedBarangay +
            ", " +
            selectedMunicipality +
            ", " +
            selectedProvince +
            ", " +
            selectedRegion;
          zoomLevel = 14; // Zoom level for barangay
        } else if (selectedMunicipality) {
          location =
            selectedMunicipality +
            ", " +
            selectedProvince +
            ", " +
            selectedRegion;
          zoomLevel = 12; // Zoom level for municipality
        } else if (selectedProvince) {
          location = selectedProvince + ", " + selectedRegion;
          zoomLevel = 10; // Zoom level for province
        }

        const coordinates = await fetchCoordinates(location);
        setMapConfig({
          center: [coordinates.lat, coordinates.lon],
          zoom: zoomLevel,
        });
        setLocationError(null);
      } catch (error) {
        setLocationError("Location not found");
      }
    };

    updateMapLocation();
  }, [
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
    selectedBarangay,
  ]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        // Initial center and zoom can be set here if needed
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Update the map view based on the selected location */}
        <UpdateMapView center={mapConfig.center} zoom={mapConfig.zoom} />

        <Marker position={mapConfig.center}>
          <Popup>
            Selected Region: {selectedRegion}
            <br />
            Selected Province: {selectedProvince}
            <br />
            Selected Municipality: {selectedMunicipality}
            <br />
            Selected Barangay: {selectedBarangay}
          </Popup>
        </Marker>
      </MapContainer>

      {locationError && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default Map;
