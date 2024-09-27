import { useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

interface QrCodeModalProps {
  data?: any;
  isOpen?: boolean;
  onClose?: () => void;
  qrValue?: string | null;
}

const QrCodeModal = ({ data, isOpen, onClose, qrValue }: QrCodeModalProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 w-[50wh] shadow-lg relative  ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        <div
          ref={componentRef}
          id="qr-code"
          className="flex flex-col items-center"
        >
          <div className="px-4 border rounded-lg m-4 text-center ">
            <h2 className="text-[24px]  font-semibold mb-4 text-center ">
              {data ? data.name : "Your QR Code"}
            </h2>
            <div className="flex justify-center mb-4">
              <QRCode value={qrValue || ""} size={150} />
            </div>
            <p>NOTE: This QR code is valid for a single use only.</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
