import { useState } from "react";
import { Event } from "../../../../model/eventsModel";
import { Person } from "../../../../model/personModel";

interface LeaderCardProps {
  leader: Person;
}

const LeaderList: React.FC<{ event: Event | null }> = ({ event }) => {
  return (
    <div className="max-h-60 overflow-y-auto space-y-2 px-4">
      {" "}
      {/* Scrollable container */}
      {event?.leaders?.map((leader, index) => (
        <LeaderCard key={index} leader={leader} />
      ))}
    </div>
  );
};

const LeaderCard = ({ leader }: LeaderCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex space-x-2 w-fit py-2 justify-center items-center">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-400 rounded-full overflow-hidden flex items-center justify-center">
        {!imageError && leader.photo ? (
          <img
            src={leader.photo}
            alt={`${leader.name.firstname} ${leader.name.lastname}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className="text-white text-xs font-semibold">
            {`${leader.name.firstname.charAt(0)}${leader.name.lastname.charAt(
              0
            )}`}
          </span>
        )}
      </div>
      <p className="lg:text-lg xl:text-xs font-medium">
        {leader.name.firstname} {leader.name.lastname}
      </p>
    </div>
  );
};

export default LeaderList;
