export class APIService {
  private query: string;

  constructor() {
    this.query = "";
  }

  protected appendToQuery(query: string): void {
    if (this.query === "") {
      this.query = `?${query}`;
    } else {
      this.query += `&${query}`;
    }
  }

  select(selectArray: string[]): this {
    selectArray.forEach((select) => this.appendToQuery(`select=${select}`));
    return this;
  }

  populate(populateArray: string[]): this {
    populateArray.forEach((populate) =>
      this.appendToQuery(`populateArray[]=${encodeURIComponent(populate)}`)
    );
    return this;
  }

  sort(sort: string): this {
    this.appendToQuery(`sort=${sort}`);
    return this;
  }

  page(page: string | number): this {
    this.appendToQuery(`page=${page}`);
    return this;
  }

  limit(limit: string | number): this {
    this.appendToQuery(`limit=${limit}`);
    return this;
  }

  fuzzy(searchTerm: string): this {
    this.appendToQuery(`fuzzy=${encodeURIComponent(searchTerm)}`);
    return this;
  }

  getQuery(): string {
    return this.query;
  }
}
