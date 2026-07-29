import { apiClient } from './apiClient';
import type { BeforeAfterCase } from '../types';

type BeforeAfterPayload = BeforeAfterCase[] | { cases?: BeforeAfterCase[]; data?: BeforeAfterCase[] } | null | undefined;

export const normalizeBeforeAfterCases = (payload: BeforeAfterPayload): BeforeAfterCase[] => {
    const rawCases = Array.isArray(payload) ? payload : (() => {
        if (payload && typeof payload === 'object') {
            const nested = (payload as { cases?: BeforeAfterCase[]; data?: BeforeAfterCase[] }).cases
                ?? (payload as { cases?: BeforeAfterCase[]; data?: BeforeAfterCase[] }).data;

            if (Array.isArray(nested)) {
                return nested;
            }
        }

        return [];
    })();

    return rawCases.map((item) => {
        const legacyItem = item as BeforeAfterCase & { id?: string; beforeImage?: string; afterImage?: string };

        return {
            ...item,
            _id: item._id ?? legacyItem.id,
            before: item.before ?? legacyItem.beforeImage ?? '',
            after: item.after ?? legacyItem.afterImage ?? '',
        };
    });
};

export const fetchBeforeAfterCases = async (): Promise<BeforeAfterCase[]> => {
    const payload = await apiClient.getBeforeAfterCases();
    return normalizeBeforeAfterCases(payload as BeforeAfterPayload);
};

export const groupBeforeAfterCases = (cases: BeforeAfterCase[]) => {
    const grouped = cases.reduce<Record<string, BeforeAfterCase[]>>((acc, item) => {
        const category = (item.category || 'General').trim() || 'General';

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(item);
        return acc;
    }, {});

    return Object.entries(grouped).map(([category, items]) => ({ category, items }));
};
