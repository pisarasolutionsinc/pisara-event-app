import { useState } from "react";
import { Attendance } from "../model/attendanceModel";
import { AttendanceService } from "../services/attendanceService";
// import { useSocket } from "./useSocket";

export const useAttendance = () => {
  // const { emitEvent } = useSocket();
  const attendanceService = new AttendanceService("attendance");
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  // useEffect(() => {
  //   // Fetch initial attendances and set up subscriptions
  //   getAttendances();
  //   fetchAttendances();
  // }, []);

  const fetchAttendances = async () => {
    try {
      await attendanceService
        .GETALL()
        .select(["timeIn", "timeOut", "status", "date", "voter", "event"])
        .populate(["voter"])
        .sort("date")
        .limit(10)
        .execute();

      // console.log("fetchAttendances result:", result);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  };

  const getAttendances = async () => {
    try {
      const result =
        (await attendanceService
          .GETALL()
          .select(["timeIn", "timeOut", "status", "date", "voter", "event"])
          .populate(["voter", "event"])
          .sort("date")
          .limit(10)
          .execute()) || [];

      if (Array.isArray(result)) {
        setAttendances(result);
      } else {
        setAttendances([]);
        console.error(
          "Unexpected response format: Expected an array but received:",
          result
        );
      }
    } catch (error) {
      console.error("Error getting attendances:", error);
      setAttendances([]);
    }
  };

  const getAttendance = async (id: string) => {
    try {
      const result =
        (await attendanceService
          .GET(id)
          .select(["timeIn", "timeOut", "status", "date", "voter", "event"])
          .populate(["voter", "event"])
          .sort("date")
          .limit(10)
          .execute()) || [];
      return result;
    } catch (error) {
      console.error("Error getting attendance:", error);
      return [];
    }
  };

  const getEventAttendances = async (id: string) => {
    try {
      if (id === "") {
        return [];
      }

      const result =
        (await attendanceService
          .SEARCH()
          .queryBy("event", id)
          .select([
            "timeIn",
            "timeOut",
            "status",
            "date",
            "voter",
            "event",
            "scannedBy",
            "duration",
            "expenses",
          ])
          .populate(["voter", "event", "scannedBy"])
          .sort("date")
          .limit(10)
          .execute()) || [];

      if (Array.isArray(result)) {
        return result;
      } else {
        setAttendances([]);
        console.error(
          "Unexpected response format: Expected an array but received:",
          result
        );
        return [];
      }
    } catch (error) {
      console.error("Error getting event attendances:", error);
      return [];
    }
  };

  const createAttendance = async (data: any) => {
    console.log("Creating attendance:", data);

    try {
      const createdAttendance = await attendanceService.POST(data).execute();
      // emitEvent("attendanceCreated", createdAttendance);
      console.log("Created attendance:", createdAttendance);
      return createdAttendance;
    } catch (error) {
      console.error("Failed to create attendance:", error);
      return [];
    }
  };

  const updateAttendance = async (data: any) => {
    console.log("Updating attendance:", data);

    try {
      const updatedAttendance = await attendanceService.PUT(data).execute();
      // emitEvent("attendanceUpdated", updatedAttendance);
      console.log("Updated attendance:", updatedAttendance);
      return updatedAttendance;
    } catch (error) {
      console.error("Failed to update attendance:", error);
      return [];
    }
  };

  const getFindVoter = async (voterId: string, eventId: string) => {
    console.log("getFindVoter called with:", voterId, eventId);

    try {
      const response =
        (await attendanceService
          .SEARCH()
          .queryBy("voter", voterId)
          .queryBy("event", eventId)
          .select([
            "timeIn",
            "timeOut",
            "status",
            "date",
            "voter",
            "event",
            "scannedBy",
            "duration",
            "expenses",
          ])
          .populate(["voter", "event", "scannedBy"])
          .sort("date")
          .limit(10)
          .execute()) || [];

      console.log("Search response:", response);
      return response;
    } catch (error) {
      console.error("Error in getFindVoter:", error);
      return [];
    }
  };

  return {
    attendances,
    getAttendances,
    fetchAttendances,
    getAttendance,
    createAttendance,
    getEventAttendances,
    getFindVoter,
    updateAttendance,
  };
};
