interface ConfirmationCardProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationCard = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationCardProps) => {
  return (
    <div className="bg-white border rounded shadow-xl p-4 absolute top-2 left-5 transform -translate-x-1/2 z-10 w-[200px]">
      <h3 className="text-lg font-bold mb-2 text-gray-500">{title}</h3>
      <p className="text-xs">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onConfirm}
          className="text-green-500 font-semibold  px-2 py-1 "
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="text-red-500 font-semibold   px-2 py-1 "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default ConfirmationCard;
