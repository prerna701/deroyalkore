import { useState, useCallback, useEffect } from 'react';
import type { BeforeAfterCase } from '../types';
import { fetchBeforeAfterCases } from '../services/beforeAfterService';

export const useBeforeAfterCases = () => {
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

        window.addEventListener('focus', handleRefresh);
        window.addEventListener('before-after-updated', handleRefresh);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleRefresh);
            window.removeEventListener('before-after-updated', handleRefresh);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refetch]);

    return { cases, loading, refetch };
};
