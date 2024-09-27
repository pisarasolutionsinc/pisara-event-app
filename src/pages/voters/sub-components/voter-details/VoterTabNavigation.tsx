// VoterTabNavigation.tsx

interface VoterTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VoterTabNavigation = ({
  activeTab,
  onTabChange,
}: VoterTabNavigationProps) => (
  <div className="border-b border-gray-200 mb-4">
    <nav className="-mb-px flex space-x-8">
      {["Details", "Generated ID", "History", "Event"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`text-gray-500 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
);

export default VoterTabNavigation;
