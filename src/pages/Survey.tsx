import React, { useEffect, useState } from "react";
import { FaSearch, FaTh, FaList, FaEllipsisV } from "react-icons/fa";
import { SURVEY_FORM } from "../config/test";
import { twMerge } from "tailwind-merge";
import { ui } from "../config/app";
import { SiGoogleforms } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { surveyService } from "../services/surveyService";
import { SurveyForm } from "../model/surveyFormModel";

const Survey = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");
  const [formList, setFormList] = useState<SurveyForm[] | []>([]);

  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const getAllSurveys = async () => {
      try {
        const result = await surveyService.GETALL();
        // console.log(result);
        setFormList(result);
      } catch (error) {}
    };

    getAllSurveys();
  }, []);

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const toggleMenu = (index: number) => {
    setMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleOpenPage = (surveyId: string) => {
    navigate(`/survey/${surveyId}/edit?tab=survey`);
  };

  const handleOpenInNewTab = (surveyId: string) => {
    const getHost = window.location.host;
    const url = `http://${getHost}/survey/${surveyId}/edit?tab=survey`;
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded px-2 py-1"
          />
          <FaSearch />
        </div>
        <div className="flex space-x-4 items-center">
          <button onClick={toggleView} className="text-sm text-gray-600">
            {isGridView ? <FaList /> : <FaTh />}
          </button>
          <button className="border-green-600 border  text-green-600 font-semibold hover:bg-green-600 hover:text-white px-2 py-1 rounded-lg ">
            Create Form
          </button>
        </div>
      </div>
      {isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formList
            .filter((survey) =>
              survey.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((survey, index) => (
              <div
                key={index}
                className="p-4 border rounded bg-white shadow-sm relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold mb-2">{survey.title}</h3>
                  <button onClick={() => toggleMenu(index)}>
                    <FaEllipsisV />
                  </button>
                </div>
                <p>
                  <strong>Date Created:</strong> {survey.date}
                </p>
                <p>
                  <strong>Author:</strong> {survey.author}
                </p>
                <p>
                  <strong>Access:</strong> {survey.access}
                </p>
                <p>
                  <strong>Status:</strong> {survey.status}
                </p>
                {menuIndex === index && (
                  <div className="absolute top-10 right-0 w-48 bg-white border rounded shadow-lg z-10">
                    <ul>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Rename
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Delete
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleOpenInNewTab(survey.id)}
                      >
                        Open in New Tab
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="overflow-x-auto pb-96">
          <table
            className={twMerge(
              "min-w-full ",
              ui.class.table.main[ui.class.use]
            )}
          >
            <thead className={twMerge(ui.class.table.header[ui.class.use])}>
              <tr>
                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                >
                  Name
                </th>
                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                >
                  Owner
                </th>
                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                >
                  Date Created
                </th>

                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                >
                  Access
                </th>
                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                >
                  Status
                </th>
                <th
                  className={twMerge(
                    "text-left",
                    ui.class.table.th[ui.class.use]
                  )}
                ></th>
              </tr>
            </thead>
            <tbody>
              {SURVEY_FORM.filter((survey) =>
                survey.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((survey, index) => (
                <tr
                  key={index}
                  className={twMerge(" ", ui.class.table.trb[ui.class.use])}
                  onMouseEnter={() => {
                    setIsHovered(true);
                    setHoveredItem(survey.id);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <td
                    className={twMerge(
                      "py-2 flex items-center gap-2 font-semibold hover:text-blue-600",
                      isHovered && survey.id === hoveredItem
                        ? `${
                            ui.class.table.item_hover[ui.class.use] +
                            " rounded-l-lg"
                          }`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                    onClick={() => handleOpenPage(survey.id)}
                  >
                    <SiGoogleforms
                      size={20}
                      className="text-primary-base text-blue-600"
                    />
                    {survey.title}
                  </td>
                  <td
                    className={twMerge(
                      "py-2 ",
                      isHovered && survey.id === hoveredItem
                        ? `${ui.class.table.item_hover[ui.class.use]}`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                  >
                    {survey.author}
                  </td>
                  <td
                    className={twMerge(
                      "py-2  ",
                      isHovered && survey.id === hoveredItem
                        ? `${ui.class.table.item_hover[ui.class.use]}`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                  >
                    {new Date(survey.date).toDateString()}
                  </td>

                  <td
                    className={twMerge(
                      "py-2 ",
                      isHovered && survey.id === hoveredItem
                        ? `${ui.class.table.item_hover[ui.class.use]}`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                  >
                    {survey.access}
                  </td>
                  <td
                    className={twMerge(
                      `${"py-2 "}`,
                      isHovered && survey.id === hoveredItem
                        ? `${ui.class.table.item_hover[ui.class.use]}`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                  >
                    <div
                      className={` px-2 w-fit font-semibold  rounded-full ${
                        survey.status === "open"
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {survey.status}
                    </div>
                  </td>
                  <td
                    className={twMerge(
                      "py-2 relative ",
                      isHovered && survey.id === hoveredItem
                        ? `${
                            ui.class.table.item_hover[ui.class.use] +
                            " rounded-r-lg"
                          }`
                        : "",
                      ui.class.table.td[ui.class.use]
                    )}
                  >
                    <button onClick={() => toggleMenu(index)}>
                      <FaEllipsisV
                        size={15}
                        className="text-center mx-auto text-gray-500"
                      />
                    </button>
                    {menuIndex === index && (
                      <div className="absolute top-10 right-0 w-48 bg-white border rounded shadow-lg z-10">
                        <ul>
                          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                            Rename
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                            Delete
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleOpenInNewTab(survey.id)}
                          >
                            Open in New Tab
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Survey;
