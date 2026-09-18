import api from "./api.js";

export const contactService = {
  send: (data) => api.post("/contact", data),
  getAll: () => api.get("/contact"),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};
