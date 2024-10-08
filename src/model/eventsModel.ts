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
  leaders?: Person[];
  organizer?: string;
  category: EventCategory;
  link?: string;
  totalExpenses: number;
  status: EventStatus;
  attendees?: Attendance[];
  totalAttendees: number;
  template?: {
    id?: string[];
    welcome?: string[];
    certificate?: string[];
  };
}
