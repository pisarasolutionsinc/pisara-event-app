import React, { useState, useEffect } from "react";
import { Attendance } from "../../model/attendanceModel";

interface MoneyModalProps {
  result: Attendance | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, result: Attendance | null) => void;
}

const MoneyModal: React.FC<MoneyModalProps> = ({
  result,
  isOpen,
  onClose,
  onSave,
}) => {
  // Store the amount as a string to allow empty inputs
  const [amount, setAmount] = useState<string>("");

  const presetAmounts = [100, 200, 500, 1000];

  const handlePresetClick = (preset: number) => {
    setAmount((prevAmount) => {
      const newAmount = parseFloat(prevAmount) || 0;
      return (newAmount + preset).toString();
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value); // Allow any value, including an empty string
  };

  const handleClear = () => {
    setAmount("");
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > 0 && result) {
      onSave(parsedAmount, result);
      onClose();
    }
  };

  // Reset the amount when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(""); // Clear the amount on modal open
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          {/* X Button to Close */}
          <button
            className="absolute top-3 right-3 text-gray-500   hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Set Amount
          </h2>

          {/* Amount Input with Clear Icon */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">
              Enter Specific Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {amount && (
                <button
                  onClick={handleClear}
                  className="absolute inset-y-0 right-2    focus:outline-none"
                >
                  <p className="bg-red-500 px-2 text-gray-200 hover:text-amber-400  rounded-full">
                    &times;
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className="px-4 py-2 bg-blue-500 text-white border border-blue-300 rounded-sm hover:text-amber-100 hover:bg-blue-600"
              >
                +{preset}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MoneyModal;
