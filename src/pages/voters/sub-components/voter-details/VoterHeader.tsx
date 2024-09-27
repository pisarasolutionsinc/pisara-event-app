interface VoterHeaderProps {
  title: string;
  onBackClick: () => void;
}

const VoterHeader = ({ title, onBackClick }: VoterHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <button onClick={onBackClick} className="text-blue-500 hover:text-blue-700">
      Back
    </button>
  </div>
);

export default VoterHeader;
