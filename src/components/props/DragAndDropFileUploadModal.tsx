import usePropsContext from "../../hooks/usePropsContext";
import { DragAndDropFileUploadProps } from "../../model/propsModel";

const DragAndDropFileUploadModal = ({
  onFileUpload,
}: DragAndDropFileUploadProps) => {
  const {
    dragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    fileInputRef,
  } = usePropsContext();

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragEnter}
      onDrop={(e) => handleDrop(e, onFileUpload)}
      className={`border-dashed border-4 p-6 text-center ${
        dragging ? "border-blue-600" : "border-gray-400"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg w-3/4 max-h-3/4 overflow-y-auto">
          <p className="mb-4">
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
          <label
            htmlFor="file-upload"
            className="cursor-pointer mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload from Computer
          </label>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropFileUploadModal;
