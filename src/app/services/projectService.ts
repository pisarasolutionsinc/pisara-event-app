// UserService.ts
import { APIService } from "./APIService";
import { useAsyncFetch } from "../utils/useFetch";
import { API_ENDPOINTS } from "../config/endpointConfig";
import { APP_CONSTANTS } from "../config/config";

export class ProjectService extends APIService {
  private asyncFetch;

  constructor() {
    super();
    this.asyncFetch = useAsyncFetch();
  }

  async create(data: any) {
    return this.asyncFetch.post(
      `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.PROJECT.CREATE}`,
      {
        body: JSON.stringify(data),
        headers: {
          [APP_CONSTANTS.HEADER.KEY.CONTENT_TYPE]:
            APP_CONSTANTS.HEADER.VALUE.APPLICATION_JSON,
        },
      }
    );
  }

  async get(id: string) {
    const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.PROJECT.GET.replace(
      ":id",
      id
    )}${this.query}`;
    this.resetQuery();
    return this.asyncFetch.get(url);
  }

  async getAll(page: number = 1, limit: number = 10) {
    this.resetQuery();
    return this.asyncFetch.get(
      `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.GET_ALL}${this.query}&page=${page}&limit=${limit}`
    );
  }

  async update(id: string, data: any) {
    const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.PROJECT.UPDATE.replace(
      ":id",
      id
    )}`;
    return this.asyncFetch.put(url, {
      body: JSON.stringify(data),
      headers: {
        [APP_CONSTANTS.HEADER.KEY.CONTENT_TYPE]:
          APP_CONSTANTS.HEADER.VALUE.APPLICATION_JSON,
      },
    });
  }

  async delete(id: string) {
    const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.PROJECT.REMOVE.replace(
      ":id",
      id
    )}`;
    return this.asyncFetch.delete(url);
  }

  async search(query: string) {
    this.resetQuery();
    return this.asyncFetch.get(
      `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.PROJECT.SEARCH}${this.query}&search=${query}`
    );
  }
}
