import { Link } from "react-router-dom";
import { capitalizeWords, abbreviateNumber } from "../../utils/common";

interface TotalAndRankCardProps {
    title: string;
    count: number;
    rows: [{ label: string; link: string; count: number; }];
}

const TotalAndRankCard = ({ title, count, rows }: TotalAndRankCardProps) => {
  const filledRows = [...rows];
  while (filledRows.length < 3) {
    filledRows.push({ label: '', link: '#', count: 0 });
  }
  return (
    <>
      <div className="bg-white rounded-lg border-1 border-gray-300 p-3 flex flex-col justify-between h-48 text-center">
        <div>
          <p className="text-2xs sm:text-base md:text-xs font-bold text-gray-400">{capitalizeWords(title)}</p>
          <p className="text-3xl sm:text-2xl md:text-4xl font-bold mt-2 text-blue-600">{abbreviateNumber(count)}</p>
        </div>
        <hr className="my-2" />
        <div className="flex flex-col space-y-1">
          {filledRows.map((row, index) => (
            <div className="flex justify-between text-left text-xs sm:text-base md:text-md " key={index}>
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
