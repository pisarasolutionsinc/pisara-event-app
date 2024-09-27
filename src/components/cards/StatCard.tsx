import { twMerge } from "tailwind-merge";

interface StatCardProps {
  title: string;
  value: number | string;
  variant?:
    | "default"
    | "custom"
    | "gradient"
    | "borderedIcon"
    | "dark"
    | "design1"
    | "design2";
  icon?: React.ReactNode;
  classParent?: string;
  classIcon?: string;
  classTitle?: string;
  classValue?: string;
}

export const StatCard = ({
  title,
  value,
  variant = "default",
  icon,
  classParent,
  classIcon,
  classTitle,
  classValue,
}: StatCardProps) => {
  // Define the different variants
  const variants = {
    default: () => (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold mb-4">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    ),
    custom: () => (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold mb-4">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    ),
    gradient: () => (
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-xl shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
        <p className="text-3xl text-white">{value}</p>
      </div>
    ),
    borderedIcon: () => (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <span className="mr-2 text-blue-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <p className="text-2xl">{value}</p>
      </div>
    ),
    dark: () => (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
        <p className="text-2xl text-white">{value}</p>
      </div>
    ),
    design1: () => (
      <div
        className={twMerge(
          `bg-white p-6 rounded-lg  flex items-center justify-between`,
          classParent
        )}
      >
        <div className="items-center text-center">
          {icon && (
            <div
              className={twMerge(
                `mr-2 bg-gray-100 rounded-full px-3 py-2  text-2xl w-fit text-gray-300  mx-auto`,
                classIcon
              )}
            >
              {icon}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3
            className={twMerge(
              "text-sm font-semibold text-gray-400",
              classTitle
            )}
          >
            {title}
          </h3>
          <p
            className={twMerge("text-2xl font-bold text-gray-500", classValue)}
          >
            {value}
          </p>
        </div>
      </div>
    ),
    design2: () => (
      <div
        className={twMerge(
          `bg-white p-6 rounded-lg  flex items-center justify-between`,
          classParent
        )}
      >
        <div className="text-left">
          <p
            className={twMerge("text-2xl font-bold text-gray-500", classValue)}
          >
            {value}
          </p>
          <h3
            className={twMerge(
              "text-xs font-semibold text-gray-400",
              classTitle
            )}
          >
            {title}
          </h3>
        </div>
        <div className="items-center text-center">
          {icon && (
            <div
              className={twMerge(
                `mr-2 bg-gray-100 rounded-full px-2 py-2  text-2xl w-fit text-gray-300  mx-auto`,
                classIcon
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    ),
  };

  // Render the variant based on the variant prop
  const Component = variants[variant];

  return <Component />;
};
