import { AiOutlineClose } from "react-icons/ai";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  positionClasses: string;
}

const Toast = ({ message, type, onClose, positionClasses }: ToastProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed mx-auto p-4 rounded shadow-lg ${getTypeStyles()} ${positionClasses}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          <AiOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default Toast;
