// InputField.tsx
import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const VoterInput: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border-gray-300 rounded-md focus:border px-4 py-2 focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default VoterInput;
