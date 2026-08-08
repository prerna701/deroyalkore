import { getStoredAdminSession } from '../utils/adminAuth';

const BASE_URL = import.meta.env.VITE_BACKEND_DOMAIN ? `${import.meta.env.VITE_BACKEND_DOMAIN}/v1` : '/api/v1';

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
    },

    getAboutSections: async () => {
        const response = await fetch(`${BASE_URL}/about?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    createAboutSection: async (payload: any) => {
        const response = await fetch(`${BASE_URL}/about`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    updateAboutSection: async (id: string, payload: any) => {
        const response = await fetch(`${BASE_URL}/about/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    deleteAboutSection: async (id: string) => {
        const response = await fetch(`${BASE_URL}/about/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    getContactSections: async () => {
        const response = await fetch(`${BASE_URL}/contact?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    createContactSection: async (payload: any) => {
        const response = await fetch(`${BASE_URL}/contact`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    updateContactSection: async (id: string, payload: any) => {
        const response = await fetch(`${BASE_URL}/contact/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    deleteContactSection: async (id: string) => {
        const response = await fetch(`${BASE_URL}/contact/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    getGallerySections: async () => {
        const response = await fetch(`${BASE_URL}/gallery?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    createGallerySection: async (payload: any) => {
        const response = await fetch(`${BASE_URL}/gallery`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    updateGallerySection: async (id: string, payload: any) => {
        const response = await fetch(`${BASE_URL}/gallery/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    deleteGallerySection: async (id: string) => {
        const response = await fetch(`${BASE_URL}/gallery/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    uploadGalleryImages: async (files: File[]): Promise<Array<{ url: string; publicUrl: string; filename: string; originalName: string }>> => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const response = await fetch(`${BASE_URL}/gallery/upload-images`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData,
        });
        return handleResponse(response);
    },

    createAppointment: async (payload: any) => {
        const response = await fetch(`${BASE_URL}/appointments`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    getAppointments: async () => {
        const response = await fetch(`${BASE_URL}/appointments?t=${Date.now()}`, {
            method: 'GET',
            headers: getHeaders(),
            cache: 'no-store'
        });
        return handleResponse(response);
    },

    updateAppointmentStatus: async (id: string, status: string) => {
        const response = await fetch(`${BASE_URL}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    }
};
