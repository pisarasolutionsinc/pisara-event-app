import { useRef, useState, useEffect, useCallback } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

export const useScanner = (handleScan: (result: string) => void) => {
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const lastScannedValueRef = useRef<string | null>(null);
  const cooldownPeriod = 5000; // 5-second cooldown

  const processResult = useCallback(
    (resultText: string) => {
      const now = Date.now();
      if (
        now - lastScanTimeRef.current > cooldownPeriod ||
        resultText !== lastScannedValueRef.current
      ) {
        setResult(resultText);
        handleScan(resultText);
        lastScanTimeRef.current = now;
        lastScannedValueRef.current = resultText;
      }
    },
    [handleScan]
  );

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error("No video input devices found");
        }

        const firstDeviceId = videoInputDevices[0].deviceId;

        if (videoRef.current) {
          codeReader.decodeFromVideoDevice(
            firstDeviceId,
            videoRef.current,
            (scanResult: Result | undefined) => {
              if (scanResult) {
                processResult(scanResult.getText());
              }
            }
          );
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, [processResult]);

  return {
    result,
    videoRef,
    setResult,
  };
};
