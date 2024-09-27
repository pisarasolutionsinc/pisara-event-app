import { API, app, ENDPOINTS } from "../config/app";
import { Attendance } from "../model/attendanceModel";

export const attendanceService = {
  GETALL,
  GET,
  POST,
  PUT,
  DELETE,
  FIND_OR_CREATE,
  SEARCH,
};

const COLLECTION = "attendance";
const SERVICE_CONFIG = {
  REQUIREMENTS: {
    GETALL:
      "?select=voterId&select=eventId&select=date&select=timeIn&select=timeOut&select=scannedBy&select=status&select=duration&select=expenses",
    GET: "?select=voterId&select=eventId&select=date&select=timeIn&select=timeOut&select=scannedBy&select=status&select=duration&select=expenses",
    POST: "",
    PUT: "",
    DELETE: "",
    SEARCH: "",
    SEARCH_EVENTID: "",
  },
};

async function GETALL(): Promise<Attendance[] | undefined> {
  try {
    if (app.control.useTesting) {
      // Return mock data
    } else {
      const url = `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${
        ENDPOINTS.GET_ALL
      }${SERVICE_CONFIG.REQUIREMENTS.GETALL.trim()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      // Extract JSON data
      const data: Attendance[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GET(id: string): Promise<Attendance | undefined> {
  try {
    if (app.control.useTesting) {
    } else {
      const url = `${API.BASE_URL}${
        ENDPOINTS.BASE
      }${COLLECTION}${ENDPOINTS.GET_BY_ID.replace(
        ":id",
        id
      )}${SERVICE_CONFIG.REQUIREMENTS.GET.trim()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance with id: ${id}`);
      }
      const attendance: Attendance = await response.json();
      return attendance;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function FIND_OR_CREATE(): Promise<any> {
  try {
  } catch (error) {}
}

async function POST(data: Attendance): Promise<Attendance> {
  try {
    const url = `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.CREATE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Attendance = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating queue:", error);
    throw error;
  }
}

async function PUT(data: Attendance): Promise<Attendance> {
  try {
    const url = `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.UPDATE}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: Attendance = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating queue:", error);
    throw error;
  }
}

async function DELETE(): Promise<any> {
  try {
  } catch (error) {}
}

async function SEARCH(
  query: string,
  eventId: string,
  useEventId: boolean
): Promise<any> {
  try {
    if (app.control.useTesting) {
    } else {
      const url = useEventId
        ? `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.SEARCH}?search=${query}&event=${eventId}`
        : `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.SEARCH}?search=${query}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to search surveys");
      }

      const result: Attendance[] = await response.json();
      return result;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
