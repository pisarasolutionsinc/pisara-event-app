import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface UploadCardProps {
  title?: string;
  description?: string;
  onFileChange: (files: FileList | null) => void; // Expects FileList or null
  className?: string;
}

export const UploadCard = ({
  title,
  description,
  onFileChange,
  className = "",
}: UploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    onFileChange(files); // Pass the FileList to the onFileChange handler
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Extract files from the input event
    onFileChange(files); // Pass the FileList to the onFileChange handler
  };

  return (
    <div
      className={twMerge(
        `p-4 border-2 border-dashed rounded-md shadow-md bg-white flex flex-col items-center justify-center text-center transition-all duration-200`,
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
      <input
        type="file"
        onChange={handleFileChange} // File input handler
        className="mt-4 block w-full text-sm text-gray-500 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      />
    </div>
  );
};
