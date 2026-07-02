import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ============ FORM APIs ============
export const formAPI = {
  getAll: (params = {}) => api.get('/forms', { params }),
  getById: (id) => api.get(`/forms/${id}`),
  getActive: () => api.get('/forms/active'),
  create: (data) => api.post('/forms', data),
  update: (id, data) => api.put(`/forms/${id}`, data),
  delete: (id) => api.delete(`/forms/${id}`),
};

// ============ FIELD APIs ============
export const fieldAPI = {
  add: (formId, data) => api.post(`/forms/${formId}/fields`, data),
  update: (formId, fieldId, data) => api.put(`/forms/${formId}/fields/${fieldId}`, data),
  delete: (formId, fieldId) => api.delete(`/forms/${formId}/fields/${fieldId}`),
};

// ============ SUBMISSION APIs ============
export const submissionAPI = {
  submit: (formId, data) => api.post(`/forms/${formId}/submit`, { data }),
  getAll: (params = {}) => api.get('/submissions', { params }),
};

export default api;
