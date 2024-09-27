import { Link } from "react-router-dom";
import { capitalizeWords, abbreviateNumber } from "../../utils/common";

interface TotalAndRankCardProps {
    title: string;
    count: number;
    rows: [any];
  }
  
const TotalAndRankCard = ({ title, count, rows }: TotalAndRankCardProps) => {
  const filledRows = [...rows];
  while (filledRows.length < 3) {
    filledRows.push({ label: '', link: '#', number: '' });
  }
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-64 text-center">
        <div>
          <p className="text-sm sm:text-base md:text-lg font-bold text-gray-400">{capitalizeWords(title)}</p>
          <p className="text-5xl sm:text-3xl md:text-5xl font-bold mt-2 text-blue-600">{abbreviateNumber(count)}</p>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col space-y-2">
          {filledRows.map((row, index) => (
            <div className="flex justify-between text-left text-sm sm:text-base md:text-lg " key={index}>
              <div className="flex">
                <span className="font-medium text-gray-400">#{index + 1}</span>
                <Link to={row.link}>
                  <span className="ml-2 line-clamp-1 text-gray-700 hover:underline hover:text-blue-500 hover:cursor-pointer">
                    {capitalizeWords(row.label)}
                  </span>
                </Link>
              </div>
              <span className="font-bold text-gray-500">{abbreviateNumber(row.count)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TotalAndRankCard;
