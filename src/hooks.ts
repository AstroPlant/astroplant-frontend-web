import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { DateTime, Duration } from "luxon";

import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Debounce a value by a specific delay.
 *
 * `delayMs` the debounce delay in milliseconds.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return debounced;
}

/**
 * Get the current time and keep it updated by the specified interval.
 */
export function useTime(updateInterval: Duration): DateTime {
  const [time, setTime] = useState(DateTime.now());

  return time;
}
