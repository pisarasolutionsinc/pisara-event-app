import { twMerge } from "tailwind-merge";
import { Question } from "../../model/surveyFormModel";
import "./Questions.css";

export const renderQuestion = (question: Question) => {
  switch (question.type) {
    case "short_answer":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4", "")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            placeholder={question.placeholder || ""}
            required={question.required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      );
    case "paragraph":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            placeholder={question.placeholder || ""}
            required={question.required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
      );
    case "multiple_choice":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 space-y-2">
            {question.choices?.map((choice) => (
              <div key={choice.id} className="flex items-center">
                <input
                  type="radio"
                  id={choice.id}
                  name={question.id}
                  required={question.required}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor={choice.id}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case "multiple_choice_grid_categories":
      return (
        <div
          key={question.id}
          className={twMerge(
            "mb-4 bg-gray-200 shadow-md rounded p-2 md:p-4 lg:p-10",
            "bg-secondary"
          )}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {question.choices?.map((choice) => (
              <div
                key={choice.id}
                className="flex flex-col bg-white shadow-xl rounded-md p-4"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={choice.image ? choice.image : ""}
                      alt=""
                      className="h-20 w-20 rounded-full object-cover bg-amber-500"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-end justify-end mb-2">
                      <input
                        type="checkbox"
                        id={choice.id}
                        name={choice.id}
                        required={question.required}
                        className="hidden"
                      />
                      <label
                        htmlFor={choice.id}
                        className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer flex items-center justify-center"
                      >
                        <svg
                          className="hidden w-4 h-4 text-indigo-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.586 4.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </label>
                    </div>
                    <label
                      htmlFor={choice.id}
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      {choice.label}
                    </label>
                    <div className="mt-auto ">
                      <p className="text-gray-500 text-xs font-semibold">
                        {choice?.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "checkboxes":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 space-y-2">
            {question.choices?.map((choice) => (
              <div key={choice.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={choice.id}
                  name={choice.id}
                  required={question.required}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor={choice.id}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case "dropdown":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <select
            required={question.required}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {question.choices?.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "linear_scale":
      return (
        <div
          key={question.id}
          className={twMerge("mb-4 bg-white shadow-md rounded p-4")}
        >
          <label className="block text-sm font-medium text-gray-700">
            {question.title}{" "}
            {question.required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 flex justify-between">
            {question.choices?.map((choice) => (
              <div key={choice.id} className="flex flex-col items-center">
                <input
                  type="radio"
                  id={choice.id}
                  name={question.id}
                  required={question.required}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor={choice.id} className="text-sm text-gray-700">
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};
