export type EventForm = {
  projectId?: string;
  coverPhoto?: string;
  fields: {
    common: any[];
    custom: any[];
  };
  assignees?: any[];
};
