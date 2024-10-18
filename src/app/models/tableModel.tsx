import { Field } from "./fieldModels";

export interface TableModel {
  _id?: string;
  name: string;
  description: string;
  fields: [Field];
}
