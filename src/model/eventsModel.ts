import { EventCategory, EventStatus } from "../config/modelConfig";
import { Attendance } from "./attendanceModel";
import { Address } from "./collectionModel";
import { Person } from "./personModel";

export interface Event {
  _id?: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: Address[];
  coverPhoto?: string;
  photos?: string[];
  leaders: Person[];
  category: EventCategory;
  link?: string;
  totalExpenses: number;
  status: EventStatus; // "pending" | "active" | "done" | "cancelled"
  attendees?: Attendance[];
  totalAttendees: number;
}
