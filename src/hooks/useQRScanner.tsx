import { useRef, useState, useEffect } from "react";

export const useQRScanner = (onScanComplete?: (value: string) => void) => {
  const [scannedValue, setScannedValue] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only capture input when the inputRef is focused
      if (scanning && document.activeElement === inputRef.current) {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          setScannedValue((prev) => prev + event.key);
        }
      }
    };

    const handleScanComplete = () => {
      setScanning(false);

      if (onScanComplete) {
        onScanComplete(scannedValue); // Call the callback with the scanned value
      }

      // Optionally reset scanned value after scan completion
      setScannedValue("");
    };

    const startScanSession = () => {
      setScannedValue("");
      setScanning(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Ensure we are scanning and inputRef is focused
      if (
        event.key === "Enter" &&
        scanning &&
        document.activeElement === inputRef.current
      ) {
        handleScanComplete();
      } else if (!scanning && document.activeElement === inputRef.current) {
        startScanSession();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scanning, scannedValue, onScanComplete]);

  return {
    scannedValue,
    inputRef, // Attach this ref to the input element where the scan should happen
    setScannedValue,
  };
};
