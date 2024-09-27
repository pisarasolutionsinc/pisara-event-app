import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const FormTopNavigation = () => {
  const query = useQuery();

  const initialTab = query.get("tab") || "survey";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="bg-gray-800 pt-4">
      <div className="container mx-auto flex justify-center items-center gap-8">
        <nav className="flex gap-8">
          {["survey", "reports", "respondents", "setting"].map((tab) => (
            <Link
              to={`${window.location.pathname}?tab=${tab}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-gray-300 hover:text-white ${
                activeTab === tab ? "border-b-4 border-amber-500" : ""
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default FormTopNavigation;
