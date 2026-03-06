import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add interceptor for Bearer token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const purchaseService = {
    getAll: (resource) => api.get(`/${resource}`),
    getById: (resource, id) => api.get(`/${resource}/${id}`),
    create: (resource, data) => api.post(`/${resource}`, data),
    update: (resource, id, data) => api.put(`/${resource}/${id}`, data),
    delete: (resource, id) => api.delete(`/${resource}/${id}`),
};

export default api;
