interface EventDetails {
  name: string;
  date: string;
  location: string;
}

interface Signatory {
  name: string;
  position: string;
}

export interface Certificate {
  title: string;
  titleCaption: string;
  awardee: string;
  awardeeCaption: string;
  event: EventDetails;
  message: string;
  signatories: Signatory[];
  status: "active" | "inactive";
  presentedBy: string;
  backgroundPhoto: string;
  logo: string;
  type: "template" | "custom";
  category: "appreciation" | "attendance" | "custom";
  isDefault: boolean;
}
