import { API, ENDPOINTS } from "../config/app";
import { Certificate as Model } from "../model/certificateModel";
import { APIService } from "./apiService";

export class CertificateService extends APIService {
  private collection: string;
  private endpoint: string;
  private selectFields: Set<string>;
  private sortFields: Set<string>;
  private limitValue: number | undefined;
  private populateFields: string[];
  private pageValue: number | undefined;
  private queryParams: Record<string, any> = {};
  private method: "GET" | "POST" | "PUT" | "DELETE" = "GET";
  private data: Record<string, any> = {}; // Holds the request body data

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
    this.endpoint = "/create";
    this.method = "POST";
    this.data = data;
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
    this.endpoint = "/search";
    this.method = "POST";
    return this;
  }

  COUNT(): this {
    this.endpoint = "/count";
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

  page(page: number): this {
    this.queryParams["page"] = page;
    return this;
  }

  populate(populates: string[]): this {
    this.populateFields = populates;
    return this;
  }

  private buildQueryParams(): string {
    const params = new URLSearchParams();

    if (this.selectFields.size > 0) {
      this.selectFields.forEach((field) => params.append("select", field));
    }

    if (this.sortFields.size > 0) {
      params.append("sort", Array.from(this.sortFields).join(","));
    }

    if (this.limitValue !== undefined) {
      params.append("limit", this.limitValue.toString());
    }

    if (this.pageValue !== undefined) {
      params.append("page", this.pageValue.toString());
    }

    // Update how populate fields are added to the query
    if (this.populateFields.length > 0) {
      this.populateFields.forEach((field) =>
        params.append("populateArray[]", field)
      );
    }

    // Add other query params
    Object.keys(this.queryParams).forEach((key) => {
      params.append(key, this.queryParams[key]);
    });

    return params.toString();
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

    if (this.pageValue !== undefined) {
      body.page = this.pageValue;
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

    // console.log("Generated Body:", body);
    return body;
  }

  public async fetchData(): Promise<Model | Model[] | undefined> {
    let url = `${API.BASE_URL}${ENDPOINTS.BASE}${this.collection}${this.endpoint}`;

    // Add query params to the URL if it's a GET request
    if (this.method === "GET" || this.method === "DELETE") {
      const queryString = this.buildQueryParams();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // console.log("body", JSON.stringify(this.getBody()));
    const options: RequestInit = {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        (this.method === "POST" || this.method === "PUT") &&
        Object.keys(this.getBody()).length > 0
          ? JSON.stringify(this.getBody())
          : undefined,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}. Error: ${errorText}`
        );
      }

      const data = await response.json();
      return this.method === "GET" && this.endpoint.startsWith("/get/")
        ? (data as Model)
        : (data as Model[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async execute(): Promise<Model | Model[] | undefined> {
    return this.fetchData();
  }
}
