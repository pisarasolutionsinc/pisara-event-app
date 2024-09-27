import { useEffect, useRef } from "react";

/**
 * A utility that mimics `useEffect` but only runs on mount (like componentDidMount).
 * @param hookFn - The effect function to run.
 */
export const useHookOnce = (hookFn: () => void | (() => void)) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      return hookFn();
    }
  }, []);
};

/**
 * A utility for running async functions inside `useEffect`, managing dependencies and cleanup.
 * @param asyncFunction - The asynchronous function to run inside `useEffect`.
 * @param deps - The dependency array for `useEffect`.
 */
export const useAsyncHook = (
  asyncFunction: () => Promise<void>,
  deps: React.DependencyList
) => {
  useEffect(() => {
    let isMounted = true;

    const runAsyncFunction = async () => {
      try {
        await asyncFunction();
      } catch (error) {
        console.error("Error in async hook:", error);
      }
    };

    if (isMounted) {
      runAsyncFunction();
    }

    return () => {
      isMounted = false; // Clean up function
    };
  }, deps);
};
