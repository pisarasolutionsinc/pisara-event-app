import { PiPlusBold } from "react-icons/pi";
import { Card } from "../../../../components/cards/Card";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type AddEventCardProps = {
  projectKey: string;
  className?: string;
};

export const AddEventCard = ({ projectKey, className }: AddEventCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/${projectKey}/event/create`);
      }}
      className={twMerge(
        `shadow-none border-dashed border-4 flex justify-center items-center`,
        className
      )}
    >
      <div className="flex flex-col items-center">
        <PiPlusBold className="text-5xl text-gray-300" />
        <p className="text-gray-400">Add Event</p>
      </div>
    </Card>
  );
};
