import { useEffect, useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import { getShade } from "../../utils/common";
import { LoadingSkeleton } from "../others/SkeletonText";
// import Legend from "./GeomapLegend";

interface GeoMapProps {
  data: [];
  center: number[];
  zoom: number;
}

// const GeomapCard = ({ data, center, zoom }: GeoMapProps) => {
const GeomapCard = ({ data, zoom }: GeoMapProps) => {
  const [mapData, setMapData] = useState([]);
  const [barangayData, setBarangayData] = useState(null);
  const [municipalityData, setMunicipalityData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [topLocations, setTopLocations] = useState([]);
  console.log(mapData, zoom);
  useEffect(() => {
    async function fetchGeoData() {
      setLoading(true);
      try {
        const [barangayDataRes, municipalityDataRes, provinceDataRes] =
          await Promise.all([
            fetch("/geomaps/Barangays.json").then((response) =>
              response.json()
            ),
            fetch("/geomaps/Municipalities.json").then((response) =>
              response.json()
            ),
            fetch("/geomaps/Provinces.json").then((response) =>
              response.json()
            ),
          ]);
        setBarangayData(barangayDataRes);
        setMunicipalityData(municipalityDataRes);
        setProvinceData(provinceDataRes);
      } catch (error) {
        console.error("Error loading geo data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGeoData();
  }, []);

  useEffect(() => {
    if (!barangayData || !municipalityData || !provinceData || !data) {
      return;
    }
    setMapData(data);
    // const topLocations = preparedMapData
    //   .filter((item) => item.count > 0)
    //   .map((item) => ({
    //     id: item.id,
    //     count: item.count,
    //   }))
    //   .sort((a, b) => b.count - a.count)
    //   .slice(0, 10);
    // setTopLocations(topLocations);
    // setKey((prevKey) => prevKey + 1);
  }, [barangayData, municipalityData, provinceData, data]);

  // const getColor = (id: number) => {
  //   const index = topLocations.findIndex( (location: any) => location.id === id);
  //   return getShade(index + 1);
  // };

  // const mapStyle = (feature: any) => {
  //   const count = feature.properties.count;
  //   return {
  //     fillColor: getColor(count),
  //     weight: 0.2,
  //     opacity: 0.2,
  //     color: "black",
  //     fillOpacity: 1,
  //   };
  // };

  // const onEachFeature = (feature: any, layer: any) => {
  //   const count = feature.properties.count;
  //   layer.bindTooltip(
  //     `<strong>${feature.properties.name}</strong><br>Mentions: ${count}`,
  //     {
  //       direction: "top",
  //     }
  //   );
  // };

  //   function prepareMapData(mentionData, geoJsonData) {
  //     const locationCounts = {};

  //     mentionData.forEach((mention) => {
  //       const location = countryDataMap[mention.location];
  //       if (location) {
  //         locationCounts[location] =
  //           (locationCounts[location] || 0) + mention.count;
  //       }
  //     });

  //     const mapData = geoJsonData.features.map((feature) => {
  //       const locationCode = feature.id;
  //       const count = locationCounts[locationCode] || 0;

  //       return {
  //         id: locationCode,
  //         name: feature.properties.name,
  //         count: count,
  //         geometryType: feature.geometry.type,
  //         coordinates: feature.geometry.coordinates,
  //       };
  //     });

  //     return mapData;
  //   }

  return (
    <div className="relative shadow-md rounded-md border w-full h-full bg-white">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* <MapContainer
            center={center}
            zoom={zoom}
            minZoom={6}
            zoomControl={true}
            style={{
              height: "60vh",
              width: "100%",
              backgroundColor: "white",
              zIndex: 0,
            }}
            maxBounds={[
              [-40, -150],
              [70, 180],
            ]}
            maxBoundsViscosity={1.0}
          > */}
          {/* <MapContainer
            zoom={zoom}
            minZoom={6}
            zoomControl={true}
            style={{
              height: "60vh",
              width: "100%",
              backgroundColor: "white",
              zIndex: 0,
            }}
            maxBounds={[
              [-40, -150],
              [70, 180],
            ]}
            maxBoundsViscosity={1.0}
          > */}
          {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
          {/* {mapData.map((data, index) => (
              <GeoJSON
                key={index}
                data={{
                  type: "Feature",
                  id: index,
                  properties: {
                    count: 32,
                    name: "Test",
                  },
                  geometry: {
                    type: data.geometryType,
                    coordinates: data.coordinates,
                  },
                }}
                style={mapStyle}
                onEachFeature={onEachFeature}
              />
            ))} */}
          {/* </MapContainer> */}
          {/* <Legend getShade={getShade} topLocations={topLocations} /> */}
        </>
      )}
    </div>
  );
};

export default GeomapCard;
