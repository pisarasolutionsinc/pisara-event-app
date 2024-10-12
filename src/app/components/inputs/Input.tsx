import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps {
  label?: string;
  labelClassName?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  containerClassName?: string; // Renamed for clarity
  className?: string; // This will be for the input
  icon?: React.ReactNode;
  row?: number;
  maxHeight?: string; // e.g., '200px'
  maxRows?: number; // e.g., 4
  isRemovable?: boolean;
  onRemove?: () => void;
}
const Input = ({
  label,
  labelClassName = "",
  value,
  type = "text",
  onChange,
  placeholder = "Search...",
  containerClassName = "",
  className = "",
  icon,
  row = 4,
  maxHeight = "100px",
  isRemovable = false,
  onRemove,
}: InputProps) => {
  return (
    <div className={twMerge(`relative ${containerClassName}`)}>
      {type === "textarea" ? (
        <textarea
          rows={row}
          value={value}
          placeholder={placeholder}
          onChange={(e: any) => onChange && onChange(e)}
          className={twMerge(
            `${
              icon ? "pl-10 " : ""
            } block w-full p-2 border border-gray-300 rounded-md`,
            className
          )}
          style={{
            maxHeight: maxHeight,
          }}
        />
      ) : (
        <>
          {label && (
            <div className="flex justify-between">
              <label
                className={twMerge(
                  `text-gray-400 text-xs px-1`,
                  labelClassName
                )}
              >
                {label}
              </label>
              {isRemovable && (
                <button
                  onClick={onRemove}
                  className="text-red-500 text-xs px-1 italic"
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={twMerge(
              `${
                icon ? "pl-10 " : ""
              } block w-full p-2 border border-gray-300 rounded-md`,
              className
            )}
          />
        </>
      )}
      {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
    </div>
  );
};

export default Input;
