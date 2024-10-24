import { Field } from "../models/fieldModels";

export const ATTENDACE_FIELD: Field[] = [
  {
    name: "Id",
    type: "singletext",
    category: "id",
    option: [],
  },
  {
    name: "Ticket No",
    type: "singletext",
    category: "ticketno",
    option: [],
  },
  {
    name: "Full Name",
    type: "singletext",
    category: "fullname",
    option: [],
  },
  {
    name: "Code Name",
    type: "singletext",
    category: "codename",
    option: [],
  },
  {
    name: "First Name",
    type: "singletext",
    category: "name",
    option: [],
  },
  {
    name: "Last Name",
    type: "singletext",
    category: "lastname",
    option: [],
  },
  {
    name: "Middle Name",
    type: "singletext",
    category: "middlename",
    option: [],
  },
  {
    name: "Middle Initial",
    type: "singletext",
    category: "middleinitial",
    option: [],
  },
  {
    name: "Suffix",
    type: "singletext",
    category: "suffix",
    option: [],
  },
  {
    name: "Rank",
    type: "singletext",
    category: "rank",
    option: [],
  },
  {
    name: "Group",
    type: "multiselect",
    category: "group",
    option: [],
  },
  {
    name: "Status",
    type: "singleselect",
    category: "status",
    option: [],
  },
  {
    name: "Location",
    type: "object",
    category: "location",
    option: [],
  },

  {
    name: "Time In",
    type: "time",
    category: "timein",
    option: [],
  },
  {
    name: "Time Out",
    type: "time",
    category: "timeout",
    option: [],
  },
  {
    name: "Date",
    type: "date",
    category: "date",
    option: [],
  },
  {
    name: "Duration",
    type: "calculated",
    category: "duration",
    option: [],
  },
  {
    name: "Notes",
    type: "multitext",
    category: "notes",
    option: [],
  },
];
