import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import debounce from "lodash/debounce";

const SOCKET_URL = `http://localhost:5000`; // Replace with your production URL
// const SOCKET_URL = "https://opo-api-dev-b2e1021665b2.herokuapp.com";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection only once
    socketRef.current = io(SOCKET_URL);

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Debounce the emitEvent function to prevent rapid consecutive calls
  const debouncedEmitEvent = useCallback(
    debounce((eventName: string, data: any) => {
      if (socketRef.current) {
        socketRef.current.emit(eventName, data);
      }
    }, 2000), // Adjust debounce delay (300ms) as needed
    []
  );

  const emitEvent = useCallback(
    (eventName: string, data: any) => {
      debouncedEmitEvent(eventName, data);
    },
    [debouncedEmitEvent]
  );

  const subscribeToEvent = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on(eventName, callback);

        // Cleanup listener when the component unmounts
        return () => {
          if (socketRef.current) {
            socketRef.current.off(eventName, callback);
          }
        };
      }
    },
    []
  );

  return { socket: socketRef.current, emitEvent, subscribeToEvent };
};
