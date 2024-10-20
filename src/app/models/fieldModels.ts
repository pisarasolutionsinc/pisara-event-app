export type Field = {
  _id: string;
  name: string;
  type: string;
  category?: string;
  option?: string[];
  value: any;
};

export type FieldTable = {
  _id?: string;
  name: string;
  type: string;
  category?: string;
  option?: string[];
  required?: boolean;
};
