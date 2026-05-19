import { useState, useEffect } from 'react';

// Simple useLocalStorage hook
// Usage: const [value, setValue] = useLocalStorage(key, defaultValue)
export default function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return raw;
      }
    } catch (e) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  useEffect(() => {
    try {
      const toStore = typeof state === 'string' ? state : JSON.stringify(state);
      localStorage.setItem(key, toStore);
    } catch (e) {
      // ignore quota errors
    }
  }, [key, state]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    const handler = (e) => {
      try {
        if (e.storageArea !== localStorage || e.key !== key) return;
        if (e.newValue === null) {
          setState(undefined);
          return;
        }
        try {
          setState(JSON.parse(e.newValue));
        } catch (err) {
          setState(e.newValue);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  return [state, setState];
}
