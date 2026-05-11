import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const crmService = {
  getHistory: () => api.get('/crm/interaction-history'),
  saveInteraction: (data) => api.post('/crm/save-interaction', data),
  updateInteraction: (id, data) => api.put(`/crm/edit-interaction/${id}`, data),
};

export const aiService = {
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
};

export default api;
