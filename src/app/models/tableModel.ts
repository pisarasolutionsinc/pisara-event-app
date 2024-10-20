export type Header = {
  id: number;
  name: string;
  type: any;
  fieldType: string;
  option?: StatusOption[];
};

export type RowData = {
  [key: string]: any | any[];
};

export type SheetTableProps = {
  headers: Header[] | [];
  initialRows?: RowData[];
  onSave?: (headers: Header[], rows: RowData[]) => void;
};

export type StatusOption = {
  value: string;
  label: string;
  color: string;
};
