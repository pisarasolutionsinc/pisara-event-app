import { API, ENDPOINTS } from "../config/app";
import { Person as Model } from "../model/personModel";
import { APIService } from "./apiService";

export class PersonService extends APIService {
  private collection: string;
  private endpoint: string;
  private selectFields: Set<string>;
  private sortFields: Set<string>;
  private limitValue: number | undefined;
  private populateFields: string[];
  private queryParams: Record<string, any> = {};
  private method: "GET" | "POST" | "PUT" | "DELETE" = "GET";
  private data: Record<string, any> = {}; // Add this property to hold the data

  constructor(collection: string, endpoint: string = "") {
    super();
    this.collection = collection;
    this.endpoint = endpoint;
    this.selectFields = new Set();
    this.sortFields = new Set();
    this.populateFields = [];
  }

  GETALL(): this {
    this.endpoint = "/get/all";
    this.method = "GET";
    return this;
  }

  GET(id: string): this {
    this.endpoint = `/get/${id}`;
    this.method = "GET";
    return this;
  }

  POST(data: Record<string, any> = {}): this {
    // Accept data as a parameter
    this.endpoint = "/create";
    this.method = "POST";
    this.data = data; // Store data in the data property
    return this;
  }

  PUT(data: Record<string, any> = {}): this {
    this.endpoint = "/update";
    this.method = "PUT";
    this.data = data;
    return this;
  }

  DELETE(): this {
    this.endpoint = "/delete";
    this.method = "DELETE";
    return this;
  }

  SEARCH(): this {
    this.endpoint = "/find";
    this.method = "POST";
    return this;
  }

  queryBy(field: string, value: any): this {
    this.queryParams[field] = value;
    return this;
  }

  select(fields: string[]): this {
    fields.forEach((field) => this.selectFields.add(field));
    return this;
  }

  sort(field: string): this {
    this.sortFields.add(field);
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  populate(populates: string[]): this {
    this.populateFields = populates;
    return this;
  }

  public getBody(): Record<string, any> {
    const body: Record<string, any> = { query: { ...this.queryParams } };

    // Add select fields to the body as a space-separated string if API expects it
    if (this.selectFields.size > 0) {
      body.select = Array.from(this.selectFields).join(" ");
    }

    // Add sort fields to the body
    if (this.sortFields.size > 0) {
      body.sort = Array.from(this.sortFields).join(" ");
    }

    // Add limit to the body
    if (this.limitValue !== undefined) {
      body.limit = this.limitValue;
    }

    // Add populate fields to the body
    if (this.populateFields.length > 0) {
      body.populateArray = this.populateFields;
    }

    // Include the data if it's set
    if (this.data && Object.keys(this.data).length > 0) {
      return this.data;
    }

    return body;
  }

  public async fetchData(): Promise<Model[] | undefined> {
    const url = `${API.BASE_URL}${ENDPOINTS.BASE}${this.collection}${this.endpoint}`;

    const options: RequestInit = {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        this.method === "POST" || this.method === "PUT"
          ? JSON.stringify(this.getBody())
          : undefined,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch attendances: ${response.status} ${response.statusText}. Error: ${errorText}`
        );
      }
      const data: Model[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching attendances:", error);
      throw error;
    }
  }

  async execute(): Promise<Model[] | undefined> {
    return this.fetchData();
  }
}
