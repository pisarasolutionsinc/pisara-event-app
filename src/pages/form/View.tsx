import { renderQuestion } from "../../components/props/Questions";
import { SURVEY_FORM } from "../../config/test";

// https://oro-app.com/survey?id=FORM_1&status=Open&access=public

const SurveyForm = () => {
  return (
    <div className="justify-center flex p-4">
      {SURVEY_FORM.map((form) => (
        <form key={form.id} className="w-full  px-8 pt-6 pb-8">
          <div className="shadow-md rounded-t-xl p-4 bg-slate-900 text-white">
            <p className="text-gray-200 text-xs bg-slate-800 w-fit px-2 py-1 rounded-lg">
              Date Created: {new Date(form.date).toDateString()}
            </p>
            <div className="text-left">
              <h1 className="text-2xl font-bold">{form.title}</h1>
              <p className="text-gray-400 text-sm mt-2">{form.long_desc}</p>
            </div>
          </div>
          <div className="shadow-md rounded-b-xl p-8 bg-gray-100 space-y-6">
            {form.questions.map((question) => (
              <div key={question.id}>{renderQuestion(question)}</div>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      ))}
    </div>
  );
};

export default SurveyForm;
