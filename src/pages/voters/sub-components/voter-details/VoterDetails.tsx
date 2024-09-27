// VoterDetail.tsx
import { useState } from "react";
import VoterHeader from "./VoterHeader";
import VoterTabNavigation from "./VoterTabNavigation";
import { Person } from "../../../../model/personModel";
import renderContent from "./../RenderContent";

interface VoterDetailProps {
  selectedVoter: Person;
  setExpandedPage: any;
}

const VoterDetail = ({ selectedVoter, setExpandedPage }: VoterDetailProps) => {
  const [activeTab, setActiveTab] = useState<string>("Details");

  if (!selectedVoter) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md col-span-7 h-[90vh]">
      <VoterHeader
        title={`${selectedVoter.name.firstname} ${selectedVoter.name.lastname}`}
        onBackClick={() => setExpandedPage(false)}
      />
      <VoterTabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
      {renderContent(activeTab, selectedVoter)}
    </div>
  );
};

export default VoterDetail;
