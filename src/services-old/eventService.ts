import { app, ENDPOINTS } from "../config/app";
import { Event } from "../model/eventsModel";
import { API } from "./../config/app";

export const eventService = {
  GETALL,
  GET,
  POST,
  PUT,
  DELETE,
  SEARCH,
};

const COLLECTION = "event";
const SERVICE_CONFIG = {
  COLLECTION: "event",
  REQUIREMENTS: {
    GETALL:
      "?select=name&select=description&select=date&select=location&select=coverPhoto&select=photos&select=leaders&select=category&select=link&select=expenses&select=status&select=startTime&select=endTime&select=createdAt&select=updatedAt",
    GET: "?select=name&select=description&select=date&select=location&select=coverPhoto&select=photos&select=leaders&select=category&select=link&select=expenses&select=status&select=startTime&select=endTime&select=createdAt&select=updatedAt",
    POST: "",
    PUT: "",
    DELETE: "",
    SEARCH: "",
  },
};

async function GETALL(): Promise<Event[] | undefined> {
  try {
    if (app.control.useTesting) {
      // Return mock data
    } else {
      const url = `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${
        ENDPOINTS.GET_ALL
      }${SERVICE_CONFIG.REQUIREMENTS.GETALL.trim()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      // Extract JSON data
      const data: Event[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GET(id: string): Promise<Event | undefined> {
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
        throw new Error(`Failed to fetch event with id: ${id}`);
      }
      const event: Event = await response.json();
      return event;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function POST(event: any): Promise<Event | undefined> {
  try {
    if (app.control.useTesting) {
    } else {
      const response = await fetch(
        API.BASE_URL + ENDPOINTS.BASE + "event/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to create event. Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const newEvent: Event = await response.json();
      return newEvent;
    }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

async function PUT(): Promise<any> {
  try {
  } catch (error) {}
}

async function DELETE(): Promise<any> {
  try {
  } catch (error) {}
}

async function SEARCH(query: string): Promise<any> {
  try {
    if (app.control.useTesting) {
      // Return mock search results
    } else {
      // Perform actual network request
      const response = await fetch(
        `${API.BASE_URL}${ENDPOINTS.BASE}event/search?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search events");
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
