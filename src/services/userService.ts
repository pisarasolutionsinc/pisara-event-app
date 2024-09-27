import { API, app, ENDPOINTS } from "../config/app";
import { User } from "../model/userModel";

export const userService = {
  GETALL,
  GET,
  POST,
  PUT,
  DELETE,
  SEARCH,
  LOGIN,
  LOGOUT,
  CHECKLOGIN,
};

const SERVICE_CONFIG = {
  COLLECTION: "user",
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

async function GET(id: string): Promise<User | undefined> {
  try {
    if (app.control.useTesting) {
    } else {
      const response = await fetch(
        `${
          API.BASE_URL +
          ENDPOINTS.BASE +
          SERVICE_CONFIG.COLLECTION +
          ENDPOINTS.GET_BY_ID +
          id +
          "/" +
          SERVICE_CONFIG.REQUIREMENTS.GET
        }`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch result with id: ${id}`);
      }
      const result: User = await response.json();
      return result;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GETALL(): Promise<User[] | undefined> {
  try {
    if (app.control.useTesting) {
      // Return mock data
    } else {
      const response = await fetch(
        `${
          API.BASE_URL +
          ENDPOINTS.BASE +
          SERVICE_CONFIG.COLLECTION +
          ENDPOINTS.GET_ALL +
          SERVICE_CONFIG.REQUIREMENTS.GETALL
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      // Extract JSON data
      const data: User[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function POST(data: User): Promise<User | undefined> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.CREATE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: User = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating queue:", error);
    throw error;
  }
}

async function PUT(data: User): Promise<User> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.UPDATE}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: User = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating queue:", error);
    throw error;
  }
}

async function DELETE(id: string): Promise<User> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${
        SERVICE_CONFIG.COLLECTION
      }${ENDPOINTS.DELETE.replace(":id", id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function LOGIN(credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function LOGOUT(): Promise<User> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.LOGOUT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function CHECKLOGIN(): Promise<User> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${ENDPOINTS.BASE}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.CHECKLOGIN}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function SEARCH(
  query: string,
  type: string,
  useType: boolean
): Promise<User[] | undefined> {
  try {
    if (app.control.useTesting) {
    } else {
      const url = useType
        ? `${API.BASE_URL}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.BASE}${ENDPOINTS.SEARCH}?search=${query}&type=${type}&sort=name.firstname&limit=5`
        : `${API.BASE_URL}${SERVICE_CONFIG.COLLECTION}${ENDPOINTS.BASE}${ENDPOINTS.SEARCH}?search=${query}&sort=name.firstname&limit=5`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to search surveys: ${response.statusText}`);
      }

      const result: User[] = await response.json();

      return result;
    }
  } catch (error) {
    console.error("Error in SEARCH function:", error);

    throw error;
  }
}
