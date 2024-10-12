import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

interface CoverPhotoCardProps {
  title: string;
  description?: string;
  className?: string;
}

export const CoverPhotoCard: React.FC<CoverPhotoCardProps> = ({
  title,
  description,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

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
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePhotoClick = () => {
    document.getElementById("cover-photo-input")?.click();
  };

  const handleRemovePhoto = () => {
    setBackgroundImage(null);
  };

  return (
    <div
      className={twMerge(
        `relative h-[300px] p-4 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center text-center transition-all duration-200`,
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
        backgroundImage ? "bg-cover bg-center" : "",
        className
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!backgroundImage && (
        <div className="z-10">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      {backgroundImage && (
        <>
          <div className="absolute bottom-5 right-5 flex items-center space-x-3 text-white">
            <button
              onClick={handleChangePhotoClick}
              className="bg-white text-black py-3 px-3 rounded-full hover:bg-gray-200"
            >
              <FaPencil className="text-xl text-blue-500" />
            </button>
            <button
              onClick={handleRemovePhoto}
              className="bg-red-500 text-white py-3 px-3 rounded-full hover:bg-red-600"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </>
      )}
      <input
        id="cover-photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};
