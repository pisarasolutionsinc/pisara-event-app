import { ElectionType } from "../config/common";
import { Votes } from "./votesModel";

export interface Election {
  id: string;
  name: string;
  photo: string[];
  coverPhoto: string;
  category: ElectionType;
  startDate: string;
  endDate: string;
  status: string;
  votes: Votes[];
}
