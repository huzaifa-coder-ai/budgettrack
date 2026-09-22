import { useCallback, useEffect, useRef, useState } from "react";
import { TOAST_TIMEOUT_MS } from "../constants";

export function useToast() {
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  const showError = useCallback((msg) => {
    setError(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setError(""), TOAST_TIMEOUT_MS);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { error, showError, clearError: () => setError("") };
}