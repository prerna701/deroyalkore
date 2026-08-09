import { useState, useCallback, useEffect } from 'react';
import type { BeforeAfterCase } from '../types';
import { fetchBeforeAfterCases } from '../services/beforeAfterService';

export const useBeforeAfterCases = (options?: { refetchOnFocus?: boolean }) => {
    const refetchOnFocus = options?.refetchOnFocus ?? false;
    const [cases, setCases] = useState<BeforeAfterCase[]>([]);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        setLoading(true);

        try {
            const data = await fetchBeforeAfterCases();
            setCases(data);
        } catch (error) {
            console.error('Failed to fetch cases', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleRefresh = () => {
            void refetch();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                void refetch();
            }
        };

        if (refetchOnFocus) {
            window.addEventListener('focus', handleRefresh);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
        window.addEventListener('before-after-updated', handleRefresh);

        return () => {
            if (refetchOnFocus) {
                window.removeEventListener('focus', handleRefresh);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
            window.removeEventListener('before-after-updated', handleRefresh);
        };
    }, [refetch, refetchOnFocus]);

    return { cases, loading, refetch };
};
