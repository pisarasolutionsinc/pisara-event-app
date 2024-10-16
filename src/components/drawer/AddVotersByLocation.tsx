import Drawer from "./../cards/Drawer";
import BrgyListCard from "./../cards/BrgyListCard";
import { useState, useEffect, useCallback } from "react";
import { Person } from "../../model/personModel";
import { LOCATION_MAP } from "../../config/locationConfig";
import { useAttendance } from "../../hooks/useAttendance";
import { usePerson } from "../../hooks/usePerson";
import { useToast } from "../../context/ToastProvider";
import { useEvent } from "../../hooks/useEvent";

interface AddAttendeesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getEvent: (id: string) => Promise<any>;
}

type Barangay = {
  id: number;
  name: string;
};

const AddVotersByLocationDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  getEvent,
}: AddAttendeesDrawerProps) => {
  const { eventId, getEvent: fetchEvent } = useEvent();
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [citizens, setCitizens] = useState<Person[]>([]);
  const [selectedBarangays, setSelectedBarangays] = useState<Barangay[]>([]);
  const { createAttendance } = useAttendance();
  const { countPerson } = usePerson();
  const [barangayCounts, setBarangayCounts] = useState<Record<string, number>>(
    {}
  );
  const { showToast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const selectedFields = [
    "_id",
    "name",
    "description",
    "date",
    "location",
    "coverPhoto",
    "photos",
    "leaders",
    "category",
    "link",
    "expenses",
    "status",
    "startTime",
    "endTime",
    "createdAt",
    "updatedAt",
    "organizer",
    "template.certificate",
  ];
  const populateFields = [
    "leaders",
    "attendees",
    "attendees.voter.scannedBy",
    "template.certificate",
  ];

  useEffect(() => {
    fetchGetEvent();
  }, []);

  const fetchGetEvent = async () => {
    try {
      const result = await fetchEvent(
        eventId as string,
        selectedFields,
        populateFields
      );

      setEvent(result);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const municipality = event?.location[0]?.city;
  const region = event?.location[0]?.region;
  const province = event?.location[0]?.province;

  // Fetch barangays when event location changes
  useEffect(() => {
    if (municipality && region && province) {
      const fetchedBarangays =
        LOCATION_MAP[region]?.Provinces[province]?.Municipalities[municipality]
          ?.Barangays || [];
      setBarangays(
        fetchedBarangays.map((b, index) => ({ id: index + 1, name: b }))
      );
    } else {
      setBarangays([]);
    }
  }, [municipality, region, province]);

  // Filter citizens based on selected barangays
  useEffect(() => {
    const filteredCitizens = citizens.filter((person: Person) =>
      person.address?.some((addr) =>
        barangays.some((barangay) => addr.barangay === barangay.name)
      )
    );
    setCitizens(filteredCitizens);
  }, [barangays]);

  const countCitizensByBarangays = useCallback(async () => {
    if (selectedBarangays.length === 0) {
      setBarangayCounts({});
      return;
    }

    try {
      const counts = await Promise.all(
        selectedBarangays.map(async (barangay) => {
          const query = {
            $elemMatch: {
              province: province,
              city: municipality,
              barangay: barangay.name,
            },
          };

          const count = await countPerson("address", query);
          return { barangay: barangay.name, count };
        })
      );

      const barangayCountsMap = counts.reduce((acc, curr) => {
        acc[curr.barangay] = curr.count;
        return acc;
      }, {} as Record<string, number>);

      setBarangayCounts(barangayCountsMap);
    } catch (error) {
      console.error("Error counting citizens:", error);
    }
  }, [selectedBarangays, province, municipality, countPerson]);

  useEffect(() => {
    countCitizensByBarangays();
  }, [selectedBarangays, countCitizensByBarangays]);

  const handleBarangaySelection = (barangay: Barangay) => {
    setSelectedBarangays((prevSelected) => {
      if (prevSelected.find((b) => b.name === barangay.name)) {
        return prevSelected.filter((b) => b.name !== barangay.name);
      }
      return [...prevSelected, barangay];
    });
  };

  const handleAddVoters = async () => {
    try {
      const data = selectedBarangays.map((barangay) => ({
        event: event._id,
        date: new Date().toISOString(),
        uploadBy: "location",
        region: region,
        province: province,
        city: municipality,
        barangay: barangay.name,
      }));

      const result = await Promise.all(data.map(createAttendance));

      if (
        result &&
        result.every((res) => Array.isArray(res) && res.length > 0)
      ) {
        showToast(
          "Attendees added successfully",
          "success",
          "bottom-10 right-10"
        );
        getEvent(event._id);
        setIsDrawerOpen(false);
      } else {
        showToast(
          "Failed to add attendees because it was existing or invalid request",
          "error",
          "bottom-10 right-10"
        );
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
    }
  };

  // Calculate total citizens without selection
  const totalCitizens = citizens.length;

  // Calculate total selected citizens based on selected barangays
  const totalSelectedCitizens = selectedBarangays.reduce((total, barangay) => {
    return total + (barangayCounts[barangay.name] || 0);
  }, 0);

  return (
    <div className="overflow-y-hidden">
      <Drawer
        isOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        title="Add Attendees By Location"
        bgColor="bg-white"
        titleColor="text-black"
      >
        <div className="w-full p-4 bg-white">
          <BrgyListCard
            barangays={barangays}
            onBarangayClick={handleBarangaySelection}
            selectedBarangays={selectedBarangays}
            municipality={municipality}
            province={province}
            totalCitizens={totalCitizens} // Pass total citizens
            totalSelectedCitizens={totalSelectedCitizens} // Pass total selected citizens
          />

          {selectedBarangays.length > 0 && (
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => setSelectedBarangays([])}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVoters}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add {selectedBarangays.length} Barangay(s)
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default AddVotersByLocationDrawer;
