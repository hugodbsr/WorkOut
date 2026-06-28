import { useState, useEffect } from 'react';
import { getUITranslation } from './translation';

/**
 * Hook to safely use async UI translations in components.
 * Replaces direct calls to getUITranslation() which return a Promise.
 */
export function useUITranslation(key: string, defaultValue: string = ''): string {
    const [text, setText] = useState(defaultValue);
    useEffect(() => {
        getUITranslation(key).then(setText);
    }, [key]);
    return text;
}
