import api from "./axios.js";

// ─── Overview ────────────────────────────────────────────────────────────────

export const fetchOverview = async () => {
  const { data } = await api.get("/api/admin/overview/");
  return data;
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const fetchUsers = async ({ page = 1, search, role, banned, ordering } = {}) => {
  const { data } = await api.get("/api/admin/users/", {
    params: { page, search: search || undefined, role: role || undefined, banned, ordering },
  });
  return data;
};

export const setUserRole = async (userId, role) => {
  const { data } = await api.patch(`/api/admin/users/${userId}/role/`, { role });
  return data;
};

export const setUserBanned = async (userId, banned) => {
  const { data } = await api.post(`/api/admin/users/${userId}/ban/`, { banned });
  return data;
};

// ─── Post moderation ─────────────────────────────────────────────────────────

export const fetchAdminPosts = async ({ page = 1, status, post_type, search, reported } = {}) => {
  const { data } = await api.get("/api/admin/posts/", {
    params: {
      page,
      status: status || undefined,
      post_type: post_type || undefined,
      search: search || undefined,
      reported: reported ? "true" : undefined,
    },
  });
  return data;
};

export const moderatePost = async (postId, action, reason) => {
  const { data } = await api.post(`/api/admin/posts/${postId}/moderate/`, { action, reason });
  return data;
};

export const deletePostAsAdmin = async (postId) => {
  await api.delete(`/api/admin/posts/${postId}/`);
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const fetchReports = async ({ page = 1, status, reason } = {}) => {
  const { data } = await api.get("/api/admin/reports/", {
    params: { page, status: status || undefined, reason: reason || undefined },
  });
  return data;
};

export const reviewReport = async (reportId, action, { note, reject_post } = {}) => {
  const { data } = await api.post(`/api/admin/reports/${reportId}/review/`, {
    action,
    note,
    reject_post,
  });
  return data;
};

// ─── Creator applications ────────────────────────────────────────────────────

export const fetchApplications = async ({ page = 1, status, search } = {}) => {
  const { data } = await api.get("/api/admin/applications/", {
    params: { page, status: status || undefined, search: search || undefined },
  });
  return data;
};

export const reviewApplication = async (applicationId, action, reason) => {
  const { data } = await api.post(`/api/admin/applications/${applicationId}/review/`, {
    action,
    reason,
  });
  return data;
};
