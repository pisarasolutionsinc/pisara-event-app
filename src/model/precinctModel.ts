import { Address } from "./collectionModel";

export interface Precinct {
  id: string;
  name: string;
  adress: Address[];
  cluster: string;
}
