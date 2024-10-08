import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import usePropsContext from "../../hooks/usePropsContext";
import { DragAndDropFileUploadProps } from "../../model/propsModel";
import { RiUploadCloud2Fill } from "react-icons/ri";

interface UploadCardVariantProps extends DragAndDropFileUploadProps {
  variant?:
    | "default"
    | "custom"
    | "gradient"
    | "borderedIcon"
    | "dark"
    | "image";
  icon?: React.ReactNode;
  handleDelete?: () => void;
}

const UploadCard = ({
  onFileUpload,
  variant = "default",
  icon,
  handleDelete,
}: UploadCardVariantProps) => {
  const {
    dragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    fileInputRef,
  } = usePropsContext();

  const [isBrokenIcon, setIsBrokenIcon] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to hold the selected image

  useEffect(() => {
    setIsBrokenIcon(false);
  }, [icon]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // Create a URL for the selected file
      setSelectedImage(imageUrl); // Update state with the image URL
      onFileUpload([file]); // Call your upload function with the file in an array
    }
  };

  const variants = {
    default: () => (
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={(e) => handleDrop(e, onFileUpload)}
        className={`border-dashed border-4 p-6 text-center ${
          dragging ? "border-blue-600" : "border-gray-400"
        }`}
      >
        <p className="mb-4">Drag and drop your files here or click to upload</p>
        <input
          type="file"
          onChange={(e) => handleFileSelect(e, onFileUpload)}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          multiple
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload from Computer
        </label>
      </div>
    ),
    custom: () => (
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={(e) => handleDrop(e, onFileUpload)}
        className={`border-dashed border-2 rounded-xl p-6 text-center ${
          dragging ? "border-blue-600" : "border-gray-400"
        }`}
      >
        <p className="mb-4 font-semibold text-gray-500">
          Drag and drop your files here or click to upload
        </p>
        <input
          type="file"
          onChange={(e) => handleFileSelect(e, onFileUpload)}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          multiple
        />
        <RiUploadCloud2Fill className="text-6xl text-gray-300 mx-auto" />
        <label
          htmlFor="file-upload"
          className="cursor-pointer mt-2 px-4 py-2 text-xs text-gray-300"
        >
          Upload from Computer
        </label>
      </div>
    ),
    gradient: () => (
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-xl shadow-lg text-white">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={(e) => handleDrop(e, onFileUpload)}
          className="relative border-dashed border-4 p-6 text-center"
        >
          <p className="mb-4">Gradient Drag and Drop Area</p>
          <input
            type="file"
            onChange={(e) => handleFileSelect(e, onFileUpload)}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer mt-2 px-4 py-2 bg-white text-blue-600 rounded"
          >
            Upload from Computer
          </label>
        </div>
      </div>
    ),
    borderedIcon: () => (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={(e) => handleDrop(e, onFileUpload)}
          className="relative border-dashed border-4 p-6"
        >
          <div className="flex justify-center items-center mb-4">
            {icon && !isBrokenIcon ? (
              icon
            ) : (
              <QRCode value={"DRAG-N-DROP"} size={50} />
            )}
          </div>
          <p>Bordered Icon Drag and Drop Area</p>
        </div>
      </div>
    ),
    dark: () => (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={(e) => handleDrop(e, onFileUpload)}
          className="relative border-dashed border-4 p-6 text-center"
        >
          <p className="mb-4">Dark Mode Drag and Drop Area</p>
          <input
            type="file"
            onChange={(e) => handleFileSelect(e, onFileUpload)}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer mt-2 px-4 py-2 bg-white text-blue-600 rounded"
          >
            Upload from Computer
          </label>
        </div>
      </div>
    ),
    image: () => (
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={(e) => handleDrop(e, onFileUpload)}
        className={`border-dashed border-2 rounded-xl p-6 text-center ${
          dragging ? "border-blue-600" : "border-gray-400"
        }`}
      >
        {selectedImage === null && (
          <p className="mb-4 font-semibold text-gray-500">
            Drag and drop your files here or click to upload
          </p>
        )}
        <input
          type="file"
          onChange={handleImageSelect} // Use the new image select handler
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          multiple
        />
        {selectedImage ? ( // Display the selected image if it exists
          <div className="relative w-full max-h-[10rem] mb-4">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full max-h-[10rem]  object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                if (handleDelete) {
                  // Check if handleDelete is defined
                  handleDelete(); // Call the delete function
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full py-1 px-3 hover:bg-red-700"
            >
              X
            </button>
          </div>
        ) : (
          <RiUploadCloud2Fill className="text-6xl text-gray-300 mx-auto" />
        )}
        <label
          htmlFor="file-upload"
          className="cursor-pointer mt-2 px-4 py-2 text-xs text-gray-300"
        >
          Upload from Computer
        </label>
      </div>
    ),
  };

  const Component = variants[variant];

  return <Component />;
};

export default UploadCard;
