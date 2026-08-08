export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FAQItem[];
  meta: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

const BASE_URL = import.meta.env.VITE_BACKEND_DOMAIN
  ? `${import.meta.env.VITE_BACKEND_DOMAIN}/v1`
  : '/api/v1';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
};

export const getFaqs = async (page = 1, limit = 10): Promise<FAQApiResponse> => {
  const response = await fetch(`${BASE_URL}/faqs?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return handleResponse(response);
};

export const createFaq = async (payload: { question: string; answer: string }) => {
  const response = await fetch(`${BASE_URL}/faqs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const updateFaq = async (id: string, payload: { question?: string; answer?: string }) => {
  const response = await fetch(`${BASE_URL}/faqs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const deleteFaq = async (id: string) => {
  const response = await fetch(`${BASE_URL}/faqs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  return handleResponse(response);
};
