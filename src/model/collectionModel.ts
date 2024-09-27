import { AddressType, AddressUse } from "../config/common";

export interface Name {
  firstname: string;
  lastname: string;
  middlename?: string;
  suffix?: string;
  prefix?: string;
  degree?: string;
}

export interface Address {
  use?: AddressUse; // home, work, school, temp, old, billing, other
  type?: AddressType; // postal, physical, both
  text?: string;
  line?: string[];
  country: string;
  region: string;
  province: string;
  city: string;
  district?: string;
  barangay: string;
  street?: string; //street, house no, or bldg. name
  purok?: string;
  sitio?: string;
  overpass?: string[][];
  long?: number;
  lat?: number;
  zipcode?: string;
  postalCode?: string;
  period?: {
    start: string;
    end: string;
  };
}

export interface Leader {
  id: string;
  name: Name;
  position: string;
  contact: string;
  email: string;
  image: string;
}
