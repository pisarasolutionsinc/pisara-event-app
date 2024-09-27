import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { surveyService } from "../../services/surveyService";
import type { SurveyForm } from "../../model/surveyFormModel"; // Type-only import
import SettingFormPage from "./Setting";
import RespondentPage from "./Respondents";
import ReportPage from "./Reports";
import { FaArrowLeft } from "react-icons/fa";
import { renderEditableQuestion } from "../../components/props/EditableQuestions";
import { PiTextT } from "react-icons/pi";
import { BiParagraph } from "react-icons/bi";
// import { FcMultipleInputs } from "react-icons/fc";
// import { GiChoice } from "react-icons/gi";
import { CiCircleList } from "react-icons/ci";
import { BsUiChecksGrid, BsUiRadiosGrid } from "react-icons/bs";
import { TbLayoutGrid } from "react-icons/tb";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SurveyFormEditPage = () => {
  const [surveyData, setSurveyData] = useState<SurveyForm | null>(null);
  const query = useQuery();
  const initialTab = query.get("tab") || "survey";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getSurveyData = async () => {
      try {
        if (id) {
          const result = await surveyService.GET(id);
          console.log(result);
          setSurveyData(result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSurveyData();
  }, [id]);

  return (
    <>
      <button
        onClick={() => navigate("/survey")}
        className="text-gray-500 hover:text-blue-500"
      >
        <FaArrowLeft size={20} />
      </button>
      <div className="justify-center flex p-4">
        {surveyData &&
          initialTab &&
          (initialTab === "survey" ? (
            <form key={surveyData.id} className="w-full px-8 pt-6 pb-8">
              <div className="shadow-md rounded-t-xl p-4 bg-slate-900 text-white">
                <div className="text-left">
                  <div>
                    <input
                      className="text-2xl font-bold bg-slate-900 w-3/4 border-b-2 border-gray-400 "
                      value={surveyData.title}
                    />
                  </div>
                  <div>
                    <input
                      className="text-gray-400 text-sm mt-2 bg-slate-900 w-3/4 border-b-2 border-gray-400 "
                      value={surveyData.long_desc}
                    />
                  </div>
                </div>
              </div>
              <div className="shadow-md rounded-b-xl p-8 bg-gray-100 space-y-6">
                {surveyData.questions.map((question) => (
                  <div key={question.id}>
                    {renderEditableQuestion(question)}
                    <hr />
                    <div className="flex justify-center gap-4 p-2">
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2  p-2">
                        <PiTextT size={15} className=" " />
                      </div>
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2 p-2">
                        <BiParagraph size={15} className="  " />
                      </div>
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2 p-2">
                        <CiCircleList size={15} className="  " />
                      </div>
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2 p-2">
                        <BsUiRadiosGrid size={15} className="  " />
                      </div>
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2 p-2">
                        <BsUiChecksGrid size={15} className="  " />
                      </div>
                      <div className="text-gray-700 border-gray-400 rounded-lg  border-2 p-2">
                        <TbLayoutGrid size={15} className="  " />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          ) : initialTab === "setting" ? (
            <SettingFormPage />
          ) : initialTab === "respondents" ? (
            <RespondentPage />
          ) : initialTab === "reports" ? (
            <ReportPage />
          ) : null)}
      </div>
    </>
  );
};

export default SurveyFormEditPage;
