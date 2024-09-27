import { FormStatus, QuestionType } from "../config/common";

export interface Choice {
  id: string;
  label: string;
  category?: string;
  value?: string;
  image: string | null;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  placeholder: string | null;
  choices: Choice[] | null;
  required: boolean;
}

export interface SurveyForm {
  id: string;
  title: string;
  access: string;
  image: string | null;
  logo: string | null;
  banner: string | null;
  status: FormStatus;
  link: string;
  short_desc: string;
  long_desc: string;
  author: string;
  date: string;
  questions: Question[];
}
