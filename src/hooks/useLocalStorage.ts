import { useState } from "react";

export const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    return window.localStorage.getItem(key) ?? "";
  });

  const setValue = (value: string) => {
    setStoredValue(value);
    window.localStorage.setItem(key, value);
  };

  return [storedValue, setValue] as [string, (value: string) => void];
};
