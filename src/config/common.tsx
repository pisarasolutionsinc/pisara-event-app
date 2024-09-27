export const STATUS = {
  ATTENDANCE: {
    PENDING: "pending",
    ONDUTY: "present",
    COMPLETED: "completed",
    ABSENT: "absent",
  },
  VOTER: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },
  FORM: {
    OPEN: "open",
    CLOSED: "closed",
  },
  EVENT: {
    PENDING: "pending",
    ACTIVE: "active",
    DONE: "done",
    CANCELLED: "cancelled",
  },
} as const;

export type EventStatus = (typeof STATUS.EVENT)[keyof typeof STATUS.EVENT];
export type AttendanceStatus =
  (typeof STATUS.ATTENDANCE)[keyof typeof STATUS.ATTENDANCE];

export type VoterStatus = (typeof STATUS.VOTER)[keyof typeof STATUS.VOTER];

export type FormStatus = (typeof STATUS.FORM)[keyof typeof STATUS.FORM];

export const TYPE = {
  PERSON_ROLE: {
    ADMIN: "admin",
    USER: "user",
    VIEWER: "viewer",
  },
  PERSON_TYPE: {
    MEMBER: "member",
    WATCHER: "watcher",
    LEADER: "leader",
  },
  PERSON_CATEGORY: {
    VOTER: "voter",
    UNRIGESTERED: "unregistered",
  },
  EVENT_CATEGORY: {
    CORPORATE: "corporate",
    SOCIAL: "social",
    CULTURAL: "cultural",
    ENTERTAINMENT: "entertainment",
    SPORTS: "sports",
    EDUCATIONAL: "educational",
    OTHER: "other",
    UNKNOWN: "unknown",
  },
  GENDER: {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
  },
  ADDRESS_USE: {
    HOME: "home",
    WORK: "work",
    SCHOOL: "school",
    TEMP: "temporary",
    OLD: "old",
    BILLING: "billing",
    OTHER: "other",
  },
  ADDRESS: {
    POSTAL: "postal",
    PHYSICAL: "physical",
    BOTH: "both",
  },
  ELECTION: {
    PRESIDENTIAL: "presidential",
    GENERAL: "general",
    HOUSE: "house",
    SENATE: "senate",
    LOCAL: "local",
  },
} as const;

export const QUESTION_TYPES = {
  SHORT_ANSWER: "short_answer",
  MULTIPLE_CHOICE: "multiple_choice",
  PARAGRAPH: "paragraph",
  CHECKBOXES: "checkboxes",
  DROPDOWN: "dropdown",
  LINEAR_SCALE: "linear_scale",
  MULTIPLE_CHOICE_GRID: "multiple_choice_grid",
  MULTIPLE_CHOICE_GRID_IMAGE_CIRLCE: "multiple_choice_grid_image_circle",
  MULTIPLE_CHOICE_GRID_CATEGORIES: "multiple_choice_grid_categories",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export type Gender = (typeof TYPE.GENDER)[keyof typeof TYPE.GENDER];

export type AddressUse =
  (typeof TYPE.ADDRESS_USE)[keyof typeof TYPE.ADDRESS_USE];

export type AddressType = (typeof TYPE.ADDRESS)[keyof typeof TYPE.ADDRESS];

export type PersonRole =
  (typeof TYPE.PERSON_ROLE)[keyof typeof TYPE.PERSON_ROLE];

export type PersonType =
  (typeof TYPE.PERSON_TYPE)[keyof typeof TYPE.PERSON_TYPE];

export type PersonCategory =
  (typeof TYPE.PERSON_CATEGORY)[keyof typeof TYPE.PERSON_CATEGORY];

export type ElectionType = (typeof TYPE.ELECTION)[keyof typeof TYPE.ELECTION];

export type EventStatusType = (typeof STATUS.EVENT)[keyof typeof STATUS.EVENT];

export type FormStatusType = (typeof STATUS.FORM)[keyof typeof STATUS.FORM];

export type EventCategory =
  (typeof TYPE.EVENT_CATEGORY)[keyof typeof TYPE.EVENT_CATEGORY];
