// src/services/auditService.js
import { api } from "../api/api";

const AuditService = {
  async list({ page = 1, page_size, search, ordering } = {}) {
    const params = {};
    if (page) params.page = page;
    if (page_size) params.page_size = page_size;
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;

    const { data } = await api.get("/audit/events", { params });
    return data; // { count, next, previous, results: [] }
  },

  // Se existir endpoint de detalhe:
  async get(id) {
    const { data } = await api.get(`/audit/events/${id}`);
    return data;
  },

  // Util para extrair ?page= do "next/previous" (se vier URL absoluta)
  getPageFromUrl(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      const p = u.searchParams.get("page");
      return p ? Number(p) : null;
    } catch {
      return null;
    }
  },
};

export default AuditService;
