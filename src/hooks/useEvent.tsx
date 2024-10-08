import { useState } from "react";
import { Event } from "../model/eventsModel";
import { useParams } from "react-router-dom";
import { useAttendance } from "./useAttendance";
import { EventService } from "../services/eventService";
import { useAuth } from "./useAuth";
import { useReport } from "./useReport";

export const useEvent = () => {
  const { auth } = useAuth();
  const { createAttendance, getFindVoter, updateAttendance } = useAttendance();
  const { report, fetchReports, errorReport, loadingReport } = useReport();
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isOpenExpensesModal, setIsOpenExpensesModal] = useState(false);

  const eventService = new EventService("event");
  const { id: eventId } = useParams();

  const getEvents = async (page: number, limit: number = 10) => {
    try {
      const response = await eventService
        .GETALL()
        .select([
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
          "attendees",
          "organizer",
        ])
        .sort("-createdAt")
        .populate(["leaders", "attendees", "attendees.voter.scannedBy"])
        .limit(limit)
        .page(page)
        .execute();

      if (Array.isArray(response)) {
        setEvents(response);
      } else {
        setEvents([]);
        console.error(
          "Unexpected response format: Expected an array but received:",
          response
        );
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const getEvent = async (
    id: string,
    select: string[] = [],
    populate: string[] = []
  ): Promise<Event | null> => {
    if (!id) {
      return null;
    }

    console.log("Fetching event:", id, select, populate);

    try {
      const event = await eventService
        .GET(id)
        .select(select)
        .populate(populate)
        .execute();

      if (event && !Array.isArray(event)) {
        setEvent(event); // Update the state with the single event
        return event; // Return the event
      }

      console.warn(
        "Unexpected response format: Expected a single event, but got:",
        event
      );
      return null; // Fallback if the response is not a single event
    } catch (error) {
      console.error("Failed to fetch event", error);
      return null; // Fallback to null in case of an error
    }
  };

  const searchEvents = async (
    query: { field?: string; value?: any } = {},
    select: string[] = [],
    populate: string[] = [],
    limit: number = 10,
    page: number = 1,
    sort: string = "-createdAt"
  ) => {
    try {
      let searchQuery = eventService.SEARCH();

      if (query.field && query.value) {
        searchQuery = searchQuery.queryBy(query.field, query.value);
      }

      if (select.length > 0) {
        searchQuery = searchQuery.select(select);
      }

      if (populate.length > 0) {
        searchQuery = searchQuery.populate(populate);
      }

      searchQuery = searchQuery.sort(sort).page(page).limit(limit);

      const response = await searchQuery.execute();
      if (Array.isArray(response)) {
        setEvents(response);
        return response;
      } else {
        setEvents([]);
        console.error(
          "Unexpected response format: Expected an array",
          response
        );
        return [];
      }
    } catch (error) {
      console.error("Failed to search events", error);
      return [];
    }
  };

  const createEvent = async (event: Event): Promise<Event | null> => {
    try {
      const response = await eventService.POST(event).execute();

      // Ensure response is of type Event
      if (response && !Array.isArray(response)) {
        console.log(response);
        setEvents([...events, response as Event]); // Cast response to Event type
        // emitEvent("eventCreated", response);
        return response as Event;
      } else {
        throw new Error("Invalid response type");
      }
    } catch (error) {
      console.error("Failed to create event", error);
      return null;
    }
  };

  const updateEvent = async (event: any): Promise<Event | null> => {
    try {
      const response = await eventService.PUT(event).execute();

      if (response && !Array.isArray(response)) {
        setEvent(response as Event);
        return response as Event;
      } else {
        throw new Error("Invalid response type");
      }
    } catch (error) {
      console.error("Failed to update event", error);
      return null;
    }
  };

  const createAttendanceFromScanner = async (
    type: string,
    scanResult: string,
    eventValue: string | null = null,
    userId: string
  ) => {
    console.log("scanResult: ", scanResult, type);

    try {
      const attendanceData = {
        voter: scanResult,
        event: eventValue ?? eventId ?? "",
        scannedBy: userId,
      };

      const response = await updateAttendance(attendanceData as any);

      if (response) {
        console.log("Attendance created successfully:", response);

        return response;
      } else {
        console.error("Failed to create attendance");
        return null;
      }
    } catch (error) {
      console.error("Error during scan handling: ", error);
    }
  };

  const createEventAttendance = async (
    scanResult: string,
    eventValue: string | null = null
  ) => {
    try {
      const attendanceData = {
        voter: scanResult,
        event: eventValue ?? eventId ?? "",
      };

      const response = await updateAttendance(attendanceData as any);

      if (response) {
        console.log("Attendance created successfully:", response);

        return response;
      } else {
        console.error("Failed to create attendance");
        return null;
      }
    } catch (error) {
      console.error("Error during scan handling: ", error);
    }
  };

  const createAttendanceFromCamera = async () => {};

  const createAttendanceMultipleAttendees = async (
    selectedPersons: string[],
    eventId: string | null = null
  ) => {
    const attendancePromises = selectedPersons.map(async (personId) => {
      const data = {
        status: "pending",
        scannedBy: auth.user.id,
        uploadBy: "manual", // Ensure this value is valid for your API
        voter: personId ?? "",
        event: eventId ?? "",
        date: new Date().toISOString(),
        expenses: 0,
        duration: "0h",
      };

      try {
        // Validate data before making API call
        if (!data.uploadBy || typeof data.uploadBy !== "string") {
          throw new Error("Invalid uploadBy value");
        }

        // Check if voter already exists
        const findVoter = await getFindVoter(personId ?? "", eventId ?? "");

        if (
          Array.isArray(findVoter) &&
          findVoter.length > 0 &&
          findVoter[0]._id
        ) {
          // Voter exists, skip creating attendance
          return []; // Return an empty array to indicate skipping
        } else {
          // Create attendance
          console.log(`Attendance created for personId: ${personId}`);
          const response = await createAttendance(data);
          return response; // Return the response from createAttendance
        }
      } catch (error) {
        // Log error details for debugging
        console.error(`Failed to create attendance for personId: ${personId}`, {
          error,
          data,
        });
        return []; // Return an empty array in case of error
      }
    });

    try {
      // Wait for all promises to resolve and collect the results
      const results = await Promise.all(attendancePromises);
      console.log("All attendance records processed.");
      // Flatten the result arrays into a single array
      return results.flat(); // Flatten nested arrays into a single level
    } catch (error) {
      // Log error details if any promise fails
      console.error("Error processing attendance records:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await eventService.DELETE(id).execute();
      if (response) {
        console.log("Event deleted successfully:", response);
        return response;
      } else {
        console.error("Failed to delete event");
        return null;
      }
    } catch (error) {
      console.error("Error during event deletion:", error);
    }
  };

  return {
    eventId,
    events,
    setEvents,
    report,
    errorReport,
    loadingReport,
    getEvents,
    getEvent,
    fetchReports,
    updateEvent,
    createEvent,
    event,
    createAttendanceFromScanner,
    createAttendanceFromCamera,
    createAttendanceMultipleAttendees,
    isOpenExpensesModal,
    setIsOpenExpensesModal,
    searchEvents,
    deleteEvent,
    createEventAttendance,
  };
};
