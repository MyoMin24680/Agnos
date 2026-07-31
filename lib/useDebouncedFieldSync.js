"use client";
import { useRef, useCallback, useEffect } from "react";

// Same idea as useDebouncedCallback, but keeps ONE independent timer
// PER FIELD NAME instead of a single shared timer.
export function useDebouncedFieldSync(callback, delay = 400) {
  const timersRef = useRef({});
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return useCallback(
    (fieldName, value) => {
      if (timersRef.current[fieldName]) {
        clearTimeout(timersRef.current[fieldName]);
      }
      timersRef.current[fieldName] = setTimeout(() => {
        callbackRef.current(fieldName, value);
        delete timersRef.current[fieldName];
      }, delay);
    },
    [delay]
  );
}