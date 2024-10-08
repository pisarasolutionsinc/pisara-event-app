import {
  PersonRole,
  PersonType,
  PersonCategory,
  VoterStatus,
  Gender,
} from "../config/common";

import { Address, Name } from "./collectionModel";
import { Precinct } from "./precinctModel";

export interface Person {
  _id?: string;
  customId: string;
  precinct?: Precinct;
  organization?: string;
  occupation?: string;
  photo?: string;
  name: Name;
  address: Address[];
  contact?: string;
  email?: string;
  birthday?: string;
  age: number;
  sex: Gender; // male, female
  status?: VoterStatus; // active or inactive
  role?: PersonRole; // admin , user or viewer
  type?: PersonType; // voter, watcher, leader
  category?: PersonCategory; // voter, unregistered
}
