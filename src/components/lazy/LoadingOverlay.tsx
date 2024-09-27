import React from "react";

interface LoadingProps {
  isVisible: boolean;
  width?: number;
  height?: number;
  border: number;
  borderTop: number;
}

const LoadingOverlay: React.FC<LoadingProps> = ({
  isVisible,
  width = 10,
  height = 10,
  border,
  borderTop,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div
        className="animate-spin rounded-full"
        style={{
          width: `${width}px`, // Adjust width dynamically
          height: `${height}px`, // Adjust height dynamically
          border: `${border}px solid white`, // Adjust border size dynamically
          borderTop: `${borderTop}px solid transparent`, // For spinner effect
        }}
      ></div>
    </div>
  );
};

export default LoadingOverlay;
