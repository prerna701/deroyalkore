import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { Treatment } from '../types';

export const useTreatments = () => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTreatments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.getTreatments();
            setTreatments(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch treatments');
            console.error('Error fetching treatments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, []);

    return {
        treatments,
        loading,
        error,
        refetch: fetchTreatments
    };
};
