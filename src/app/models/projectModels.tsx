export interface ProjectItemType {
  type: string;
  fields: string[];
  workflow: string;
}

export interface Project {
  _id?: string;
  owner?: string;
  name: string;
  description?: string;
  key?: string;
  statusNotes?: {
    summary: string;
    details: string;
    date: string;
  }[];
  type?: string;
  tags?: string[];
  services?: string[];
  startDate?: string;
  endDate?: string;
  image?: string;
  attachments?: string[];
  details?: {
    color: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  members?: string[];
  itemTypes?: ProjectItemType[];
  portal?: string[];
  board?: string;
  projectCounter?: number;
  createdAt?: string;
  updatedAt?: string;
}
