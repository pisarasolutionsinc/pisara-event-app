import { app } from "../config/app";
import { SURVEY_FORM } from "../config/test";
import { SurveyForm } from "../model/surveyFormModel";

export const surveyService = {
  GETALL,
  GET,
  POST,
  PUT,
  DELETE,
  SEARCH,
};

const surveys: SurveyForm[] = SURVEY_FORM;

async function GETALL(): Promise<SurveyForm[]> {
  try {
    if (app.control.useTesting) {
      // Return mock data
      return surveys;
    } else {
      const response = await fetch(app.host.local + "/survey");
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      // Extract JSON data
      const data: SurveyForm[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GET(id: string): Promise<SurveyForm | null> {
  try {
    if (app.control.useTesting) {
      const survey =
        surveys.find((survey: SurveyForm) => survey.id === id) || null;
      return survey;
    } else {
      const response = await fetch(app.host.local + "/survey/" + id);
      if (!response.ok) {
        throw new Error(`Failed to fetch survey with id: ${id}`);
      }
      const survey: SurveyForm = await response.json();
      return survey;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function POST(): Promise<any> {
  try {
  } catch (error) {}
}

async function PUT(): Promise<any> {
  try {
  } catch (error) {}
}

async function DELETE(): Promise<any> {
  try {
  } catch (error) {}
}

async function SEARCH(query: string): Promise<any> {
  try {
    if (app.control.useTesting) {
      // Return mock search results
      const filteredSurveys = surveys.filter(
        (survey: SurveyForm) =>
          survey.title.includes(query) || survey.long_desc.includes(query)
      );
      return filteredSurveys;
    } else {
      // Perform actual network request
      const response = await fetch(
        `${app.host.local}/survey/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search surveys");
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
