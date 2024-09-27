export interface Votes {
  id: string;
  personId: string;
  precinctId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "cast" | "rejected" | "expired" | "voided";
}

// pollingPlace: string;
