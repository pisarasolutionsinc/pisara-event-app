import React, { memo } from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  label: string;
  placeholder?: string;
  inputType:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "time"
    | "url"
    | "tel";
  componentType: "input" | "textarea";
  row?: number;
  value: number | string;
  variant?: "default" | "custom" | "inputwithoverlapping";
  icon?: React.ReactNode;
  classParent?: string;
  classIcon?: string;
  classTitle?: string;
  classValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  ref?: any;
}

const InputVariants = {
  default: ({
    label,
    placeholder,
    value,
    handleChange,
    icon,
    classParent,
    classIcon,
    classTitle,
    classValue,
    isRequired,
  }: any) => (
    <div className={twMerge("relative w-full", classParent)}>
      {label && (
        <label
          htmlFor={label}
          className={twMerge(
            "block mb-1 text-sm font-medium text-gray-700",
            classTitle
          )}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={twMerge(
          "w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-200 ease-in-out",
          classValue
        )}
        required={isRequired}
      />
      {icon && (
        <div
          className={twMerge(
            "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
            classIcon
          )}
        >
          {icon}
        </div>
      )}
    </div>
  ),
  custom: ({
    label,
    placeholder,
    value,
    handleChange,
    icon,
    classParent,
    classIcon,
    classTitle,
    classValue,
    isRequired,
  }: any) => (
    <div className={twMerge("relative w-full", classParent)}>
      {label && (
        <label
          htmlFor={label}
          className={twMerge(
            "block mb-1 text-sm font-semibold text-gray-800",
            classTitle
          )}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={twMerge(
          "w-full py-2 px-3 border border-blue-500 rounded-md text-blue-700 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out",
          classValue
        )}
        required={isRequired}
      />
      {icon && (
        <div
          className={twMerge(
            "absolute inset-y-0 right-0 pr-3 flex items-center",
            classIcon
          )}
        >
          {icon}
        </div>
      )}
    </div>
  ),
  inputwithoverlapping: ({
    label,
    placeholder,
    value,
    inputType,
    componentType,
    handleChange,
    classParent,
    isRequired,
    row = 3,
    ref,
  }: any) => (
    <>
      {componentType === "input" ? (
        <div className={twMerge("relative mt-4", classParent)}>
          <input
            type={inputType}
            id="floating-input"
            placeholder={placeholder || "Your Name"}
            className={twMerge(
              "peer h-10 w-full border px-2 rounded-md  text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 transition-colors duration-200 ease-in-out"
            )}
            onChange={handleChange}
            value={value}
            ref={ref}
            required={isRequired}
          />
          <label
            htmlFor="floating-input"
            className={twMerge(
              "absolute left-2 -top-0.5 cursor-pointer bg-white px-1 text-gray-500 text-sm transition-transform duration-200 ease-in-out transform -translate-y-1/2 scale-75 origin-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-top-0.5 peer-focus:scale-75 peer-focus:text-blue-600 peer-placeholder-shown:text-gray-500 peer:not(:placeholder-shown):-top-0.5 peer:not(:placeholder-shown):scale-75 peer:not(:placeholder-shown):text-blue-600"
            )}
          >
            {label}
          </label>
        </div>
      ) : (
        <div className={twMerge("relative mt-4", classParent)}>
          <textarea
            id="floating-input"
            placeholder=" " // Keeps a blank space to trigger the placeholder-shown effect
            className={twMerge(
              "peer w-full border px-2 py-2 rounded-md  text-gray-900 placeholder-transparent h-20 focus:outline-none focus:border-blue-600 transition-colors duration-200 ease-in-out"
            )}
            onChange={handleChange}
            rows={row} // You can adjust this or make it dynamic
            value={value}
            required={isRequired}
          ></textarea>
          <label
            htmlFor="floating-input"
            className={twMerge(
              "absolute left-2 top-2 transform -translate-y-5 bg-white px-1 text-gray-500 text-sm transition-all duration-200 ease-in-out scale-75 origin-left peer-placeholder-shown:top-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:scale-75 peer-focus:text-blue-600"
            )}
          >
            {label}
          </label>
        </div>
      )}
    </>
  ),
};

const Input = ({
  label,
  placeholder,
  value,
  variant = "default",
  icon,
  classParent,
  classIcon,
  classTitle,
  classValue,
  onChange,
  isRequired = false,
  inputType,
  componentType,
  ref,
}: StatCardProps) => {
  // Define the change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
  };

  // Render the variant based on the variant prop
  const VariantComponent = InputVariants[variant];

  return (
    <VariantComponent
      label={label}
      placeholder={placeholder}
      value={value}
      handleChange={handleChange}
      icon={icon}
      classParent={classParent}
      classIcon={classIcon}
      classTitle={classTitle}
      classValue={classValue}
      isRequired={isRequired}
      inputType={inputType}
      componentType={componentType}
      ref={ref}
    />
  );
};

export default memo(Input);
