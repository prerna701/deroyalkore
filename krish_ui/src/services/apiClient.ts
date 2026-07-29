import { getStoredAdminSession } from '../utils/adminAuth';

const BASE_URL = import.meta.env.VITE_BACKEND_DOMAIN ? `${import.meta.env.VITE_BACKEND_DOMAIN}/v1` : 'http://localhost:7000/v1';

/**
 * Helper to get headers, automatically attaching the auth token if available.
 */
const getHeaders = (isFormData = false) => {
    const session = getStoredAdminSession();
    const token = session?.token || localStorage.getItem('adminToken');
    const headers: HeadersInit = {};
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

/**
 * Helper to handle the API response parsing and error throwing.
 */
const handleResponse = async (response: Response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return data?.data ?? data;
};

export const apiClient = {
    /**
     * Authenticate and get JWT tokens
     */
    login: async (credentials: any) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    /**
     * Get all Before & After cases
     */
    getBeforeAfterCases: async () => {
        const response = await fetch(`${BASE_URL}/before-after?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    /**
     * Upload a new Before & After case
     * @param formData FormData containing label, before (file), after (file)
     */
    uploadBeforeAfterCase: async (formData: FormData) => {
        const response = await fetch(`${BASE_URL}/before-after`, {
            method: 'POST',
            // Omit Content-Type header so the browser sets it automatically with the multipart boundary
            headers: getHeaders(true),
            body: formData
        });
        return handleResponse(response);
    },

    /**
     * Get all Treatments
     */
    getTreatments: async () => {
        const response = await fetch(`${BASE_URL}/treatments?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    /**
     * Get single Treatment
     */
    getTreatment: async (idOrSlug: string) => {
        const response = await fetch(`${BASE_URL}/treatments/${idOrSlug}?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    /**
     * Create Treatment
     */
    createTreatment: async (formData: FormData) => {
        const response = await fetch(`${BASE_URL}/treatments`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        });
        return handleResponse(response);
    },

    /**
     * Update Treatment
     */
    updateTreatment: async (id: string, formData: FormData) => {
        const response = await fetch(`${BASE_URL}/treatments/${id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: formData
        });
        return handleResponse(response);
    },

    /**
     * Delete Treatment
     */
    deleteTreatment: async (id: string) => {
        const response = await fetch(`${BASE_URL}/treatments/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};
