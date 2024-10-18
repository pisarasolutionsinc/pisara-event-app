export interface Field {
  _id?: string;
  name: string;
  type: string;
  category?: string;
  option?: string[];
  required?: boolean;
}
