interface Attachment {
  type: string;
  link: string;
  createdAt?: string;
}

interface Image {
  type: string;
  link: string;
  createdAt?: string;
}

interface FieldValue {
  fieldId: string;
  value: any;
}

interface Comment {
  user: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  number: number;
  projectId: string;
  attachments: Attachment[];
  images: Image[];
  coverPhoto: string;
  fields: {
    common: FieldValue[];
    custom: FieldValue[];
  };
  comments: Comment[];
  children: string[];
  assignees: string[];
  createdAt?: string;
  updatedAt?: string;
}
