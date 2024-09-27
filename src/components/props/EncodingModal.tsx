import DragAndDropFileUpload from "./DragAndDropFileUpload";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { useConverter } from "../../hooks/useConverter";
import ModalLayout from "./ModalLayout";

interface EncodingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EncodingModal = ({ isOpen, onClose }: EncodingModalProps) => {
  const { handleFileUpload, uploadedFiles, handleGetData, handleDeleteFile } =
    useConverter();

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-sm font-bold mb-4">Encoding System</h1>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={() => {
              /* Add your functionality here */
            }}
          >
            <AiOutlinePlus className="mr-2" />
            Add
          </button>
        </div>

        <div className="items-center mb-4">
          <DragAndDropFileUpload onFileUpload={handleFileUpload} />
        </div>
        <div className="mt-4">
          <h2 className="text-sm font-bold mb-2">Uploaded Files:</h2>
          <div className="">
            {uploadedFiles.map((file, index) => (
              <div
                className="mb-2 shadow-md p-4 justify-between flex items-center rounded-lg bg-white"
                key={index}
              >
                <p>{file.name}</p>
                <div className="flex">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleGetData(file)}
                  >
                    GET DATA
                  </button>
                  <button
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteFile(index)}
                  >
                    <AiOutlineClose className="mx-auto my-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

export { EncodingModal };
