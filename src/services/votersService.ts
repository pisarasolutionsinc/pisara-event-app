import { API, app, ENDPOINTS } from "../config/app";
import { Person } from "../model/personModel";

export const votersService = {
  GETALL,
  GET,
  POST,
  PUT,
  DELETE,
  SEARCH,
};

const COLLECTION = "person";
const SERVICE_CONFIG = {
  REQUIREMENTS: {
    GETALL:
      "?select=name&select=email&select=customId&select=precinct&select=photo&select=address&select=contact&select=birthday&select=age&select=sex&select=status&select=role&select=type&select=category",
    GET: "?select=name&select=email&select=customId&select=precinct&select=photo&select=address&select=contact&select=birthday&select=age&select=sex&select=status&select=role&select=type&select=category",
    POST: "",
    PUT: "",
    DELETE: "",
    SEARCH: "",
  },
};

async function GETALL(): Promise<Person[] | undefined> {
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
      const data: Person[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GET(id: string): Promise<Person | undefined> {
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
        throw new Error(`Failed to fetch survey with id: ${id}`);
      }
      const survey: Person = await response.json();
      return survey;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function POST(): Promise<any> {
  try {
  } catch (error) {}
}

async function PUT(): Promise<any> {
  try {
  } catch (error) {}
}

async function DELETE(): Promise<any> {
  try {
  } catch (error) {}
}

async function SEARCH(
  query: string,
  type: string,
  useType: boolean
): Promise<Person[] | undefined> {
  // Explicitly define the return type

  try {
    if (app.control.useTesting) {
      // Return mock search results
    } else {
      // Perform actual network request
      const url = useType
        ? `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.SEARCH}?search=${query}&type=${type}&sort=name.firstname&limit=5`
        : `${API.BASE_URL}${ENDPOINTS.BASE}${COLLECTION}${ENDPOINTS.SEARCH}?search=${query}&sort=name.firstname&limit=5`;

      const response = await fetch(url);

      if (!response.ok) {
        // Handle non-2xx responses
        throw new Error(`Failed to search surveys: ${response.statusText}`);
      }

      const result: Person[] = await response.json(); // Type the response properly
      // console.log("result: ", result);
      return result;
    }
  } catch (error) {
    console.error("Error in SEARCH function:", error);
    // Re-throw the error so it can be caught by the calling function
    throw error;
  }
}
