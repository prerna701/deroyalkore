import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { Treatment } from '../types';

const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
};

export const useTreatments = () => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTreatments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.getTreatments();
            setTreatments(data || []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch treatments'));
            console.error('Error fetching treatments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchTreatments();
    }, [fetchTreatments]);

    return {
        treatments,
        loading,
        error,
        refetch: fetchTreatments
    };
};
