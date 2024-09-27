import { ModalProps } from "../../../model/propsModel";
import "./Modal.css";

const CodeEditorModal = ({ isOpen, onClose, data }: ModalProps) => {
  if (!isOpen) return null;

  const jsonData = JSON.stringify(data, null, 2);
  const lines = jsonData.split("\n");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4 max-h-3/4 overflow-y-auto">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={onClose}
        >
          Close
        </button>
        <div className="relative">
          <div className="editor">
            {lines.map((line, index) => (
              <div key={index} className="line">
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;
