import { useCallback, useEffect, useState, useMemo } from 'react';
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

    const treatmentsMap = import.meta.env ? (
        // Client-side environment
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useMemo(() => {
            const map = new Map<string, string>();
            treatments.forEach((t: any) => {
                const id = t.id || t._id;
                const title = t.title || t.name || id;
                if (id) map.set(id, title);
            });
            return map;
        }, [treatments])
    ) : new Map<string, string>(); // fallback if used elsewhere

    const getTreatmentName = useCallback((treatmentIds?: string[]) => {
        if (treatmentIds && treatmentIds.length > 0) {
            return (treatmentsMap as Map<string, string>).get(treatmentIds[0]) || 'General';
        }
        return 'General';
    }, [treatmentsMap]);

    return {
        treatments,
        loading,
        error,
        treatmentsMap,
        getTreatmentName,
        refetch: fetchTreatments
    };
};
