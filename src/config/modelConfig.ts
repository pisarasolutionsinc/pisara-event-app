const modelConfig = {
  STATUS: {
    ATTENDANCE: {
      PENDING: "pending",
      PRESENT: "present",
      COMPLETED: "completed",
      ABSENT: "absent",
    },
    VOTER: { ACTIVE: "active", INACTIVE: "inactive" },
    VOTES: {
      PENDING: "pending",
      CAST: "cast",
      REJECTED: "rejected",
      EXPIRED: "expired",

      VOIDED: "voided",
    },
    FORM: { OPEN: "open", CLOSED: "closed" },
    EVENT: {
      PENDING: "pending",
      ACTIVE: "active",
      DONE: "done",
      CANCELLED: "canceled",
    },
  },
  TYPES: {
    PERSON: { MEMBER: "member", WATCHER: "watcher", LEADER: "leader" },
    GENDER: { MALE: "male", FEMALE: "female" },
    ADDRESS: { POSTAL: "postal", PHYSICAL: "physical", BOTH: "both" },
    ELECTION: {
      PRESIDENTIAL: "presidential",
      GENERAL: "general",
      HOUSE: "house",
      SENATE: "senate",
      LOCAL: "local",
    },
    QUESTION: {
      SHORT_ANSWER: "short_answer",
      MULTIPLE_CHOICE: "multiple_choice",
      PARAGRAPH: "paragraph",
      CHECKBOXES: "checkboxes",
      DROPDOWN: "dropdown",
      LINEAR_SCALE: "linear_scale",
      MULTIPLE_CHOICE_GRID: "multiple_choice_grid",
      MULTIPLE_CHOICE_GRID_IMAGE_CIRCLE: "multiple_choice_grid_image_circle",
      MULTIPLE_CHOICE_GRID_CATEGORIES: "multiple_choice_grid_categories",
    },
  },
  USE: {
    ADDRESS: {
      HOME: "home",
      WORK: "work",
      SCHOOL: "school",
      TEMP: "temporary",
      OLD: "old",
      BILLING: "billing",
      OTHER: "other",
    },
  },
  CATEGORY: {
    PERSON: { VOTER: "voter", UNREGISTERED: "unregistered" },
    EVENT: {
      CORPORATE: "corporate",
      SOCIAL: "social",
      CULTURAL: "cultural",
      ENTERTAINMENT: "entertainment",
      SPORTS: "sports",
      EDUCATIONAL: "educational",
      OTHER: "other",
      UNKNOWN: "unknown",
    },
  },
  ROLE: { PERSON: { ADMIN: "admin", USER: "user", VIEWER: "viewer" } },
} as const;

type Enum<T> = { [K in keyof T]: T[K] };

const createEnum = <T>(obj: T): Enum<T> => obj;

type EnumTypes = {
  [K in keyof typeof modelConfig]: Enum<(typeof modelConfig)[K]>;
};

type DropdownOption = {
  value: string;
  label: string;
};

export const getDropdownOptions = (enumObject: object): DropdownOption[] => {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value.toLowerCase(), // Convert value to lowercase
    label: key.toLowerCase().replace(/_/g, " "), // Convert label to lowercase
  }));
};

const enums: EnumTypes = {
  STATUS: createEnum(modelConfig.STATUS),
  TYPES: createEnum(modelConfig.TYPES),
  USE: createEnum(modelConfig.USE),
  CATEGORY: createEnum(modelConfig.CATEGORY),
  ROLE: createEnum(modelConfig.ROLE),
};

export const {
  STATUS: {
    ATTENDANCE: AttendanceStatusEnum,
    VOTER: VoterStatusEnum,
    VOTES: VoteStatusEnum,
    FORM: FormStatusEnum,
    EVENT: EventStatusEnum,
  },
  TYPES: {
    PERSON: PersonTypeEnum,
    GENDER: GenderEnum,
    ADDRESS: AddressTypeEnum,
    ELECTION: ElectionTypeEnum,
    QUESTION: QuestionTypeEnum,
  },
  USE: { ADDRESS: AddressUseEnum },
  CATEGORY: { PERSON: PersonCategoryEnum, EVENT: EventCategoryEnum },
  ROLE: { PERSON: PersonRoleEnum },
} = enums;

export type PersonType = keyof typeof PersonTypeEnum;
export type Gender = keyof typeof GenderEnum;
export type AddressType = keyof typeof AddressTypeEnum;
export type ElectionType = keyof typeof ElectionTypeEnum;
export type AddressUse = keyof typeof AddressUseEnum;
export type PersonCategory = keyof typeof PersonCategoryEnum;
export type PersonRole = keyof typeof PersonRoleEnum;
export type QuestionType = keyof typeof QuestionTypeEnum;
export type VoterStatus = keyof typeof VoterStatusEnum;
export type EventStatus = keyof typeof EventStatusEnum;
export type EventCategory = keyof typeof EventCategoryEnum;
export type AttendanceStatus = keyof typeof AttendanceStatusEnum;
export type VoteStatus = keyof typeof VoteStatusEnum;
