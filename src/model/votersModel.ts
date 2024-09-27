import { Gender, PersonType } from "../config/common";
import { Address, Name } from "./collectionModel";

export interface Voters {
  id: string;
  customId: string;
  image?: string;
  name: Name;
  sex: Gender;
  birthday: string;
  age: number;
  position: PersonType;
  precinct: string;
  address: Address[];
  pollingPlace: string;
  contact: string;
  email: string;
  qrcodeValue: string;
  status?: string;
}
