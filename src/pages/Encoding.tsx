import DragAndDropFileUpload from "../components/props/DragAndDropFileUpload";
import Modal from "../components/props/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { useConverter } from "./../hooks/useConverter";

const Encoding = () => {
  const {
    handleFileUpload,
    uploadedFiles,
    handleGetData,
    handleDeleteFile,
    modalOpen,
    modalData,
    setModalOpen,
  } = useConverter();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encoding System</h1>
      <DragAndDropFileUpload onFileUpload={handleFileUpload} />
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Uploaded Files:</h2>
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
                  <AiOutlineClose className=" mx-auto my-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
    </div>
  );
};

export { Encoding };
