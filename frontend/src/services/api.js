import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Sales Services
export const getCustomers = () => api.get("/customers");
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const getProducts = () => api.get("/products");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getInquiries = () => api.get("/inquiries");
export const getInquiry = (id) => api.get(`/inquiries/${id}`);
export const createInquiry = (data) => api.post("/inquiries", data);
export const updateInquiry = (id, data) => api.put(`/inquiries/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);

export const getQuotations = () => api.get("/quotations");
export const createQuotation = (data) => api.post("/quotations", data);
export const updateQuotation = (id, data) => api.put(`/quotations/${id}`, data);
export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);

export const getSaleOrders = () => api.get("/sale-orders");
export const createSaleOrder = (data) => api.post("/sale-orders", data);
export const updateSaleOrder = (id, data) => api.put(`/sale-orders/${id}`, data);
export const deleteSaleOrder = (id) => api.delete(`/sale-orders/${id}`);

export const getDispatchAdvices = () => api.get("/dispatch-advice");
export const createDispatchAdvice = (data) => api.post("/dispatch-advice", data);
export const updateDispatchAdvice = (id, data) => api.put(`/dispatch-advice/${id}`, data);
export const deleteDispatchAdvice = (id) => api.delete(`/dispatch-advice/${id}`);

export const getInvoices = () => api.get("/invoices");
export const createInvoice = (data) => api.post("/invoices", data);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);

export const getVoucherReceipts = () => api.get("/voucher-receipts");
export const createVoucherReceipt = (data) => api.post("/voucher-receipts", data);
export const updateVoucherReceipt = (id, data) => api.put(`/voucher-receipts/${id}`, data);
export const deleteVoucherReceipt = (id) => api.delete(`/voucher-receipts/${id}`);

// Purchase & Common Services
export const purchaseService = {
    getAll: (resource) => api.get(`/${resource}`),
    getById: (resource, id) => api.get(`/${resource}/${id}`),
    create: (resource, data) => api.post(`/${resource}`, data),
    update: (resource, id, data) => api.put(`/${resource}/${id}`, data),
    delete: (resource, id) => api.delete(`/${resource}/${id}`),
};

// HR Services
export const hrService = {
    getAll: (resource) => api.get(`/${resource}`),
    getById: (resource, id) => api.get(`/${resource}/${id}`),
    create: (resource, data) => api.post(`/${resource}`, data),
    update: (resource, id, data) => api.put(`/${resource}/${id}`, data),
    delete: (resource, id) => api.delete(`/${resource}/${id}`),
};

// Assets Module
export const getAssetMasters = () => api.get("/asset-masters");
export const createAssetMaster = (data) => api.post("/asset-masters", data);
export const updateAssetMaster = (id, data) => api.put(`/asset-masters/${id}`, data);
export const deleteAssetMaster = (id) => api.delete(`/asset-masters/${id}`);

export const getAssetAdditions = () => api.get("/asset-additions");
export const createAssetAddition = (data) => api.post("/asset-additions", data);

export const getAssetAllocations = () => api.get("/asset-allocations");
export const createAssetAllocation = (data) => api.post("/asset-allocations", data);
export const updateAssetAllocation = (id, data) => api.put(`/asset-allocations/${id}`, data);

export const getAssetSales = () => api.get("/asset-sales");
export const createAssetSale = (data) => api.post("/asset-sales", data);

export const getAssetDepreciations = () => api.get("/asset-depreciations");
export const createAssetDepreciation = (data) => api.post("/asset-depreciations", data);

export default api;
