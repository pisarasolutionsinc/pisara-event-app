import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY - 10, // Adjust for scroll
      left: rect.left + window.scrollX + rect.width / 2, // Adjust for scroll
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed px-2 py-1 bg-black text-white text-xs rounded-md shadow-lg z-50"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transform: "translateX(-50%)", // Center tooltip
            }}
          >
            {text}
          </div>,
          document.body // Render tooltip in the body
        )}
    </div>
  );
};

export default Tooltip;
