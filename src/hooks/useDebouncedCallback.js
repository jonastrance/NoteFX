import { useCallback, useEffect, useRef } from 'react';
export const useDebouncedCallback = (callback, delay) => {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            void callbackRef.current(...args);
        }, delay);
    }, [delay]);
};
