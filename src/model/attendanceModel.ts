import { AttendanceStatus } from "./../config/common";

export interface Attendance {
  _id?: string;
  voter: string;
  event: string;
  date: string;
  timeIn?: string | null;
  timeOut?: string | null;
  scannedBy: string;
  uploadBy?: "manual" | "camera" | "file" | "device";
  status: AttendanceStatus; // present , completed , absent
  duration: string;
  expenses: number;
}
