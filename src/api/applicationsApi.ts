import { apiFetch } from './apiFetch';

export const fetchApplicationsByJobId = async (jobId: string | number) => {
  try {
    const res = await apiFetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600'}/api/applications/job/${jobId}`);
    if (res && (res as any).success && Array.isArray((res as any).data)) {
      return (res as any).data;
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchAllApplications = async () => {
  try {
    const res = await apiFetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600'}/api/applications/all`);
    if (res && (res as any).success && Array.isArray((res as any).data)) {
      return (res as any).data;
    }
    return [];
  } catch {
    return [];
  }
};


export const applyForJob = async (applicantData: {
  jobId: string;
  cv_url: string;
  cover_letter: string;
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/applications`, {
    method: 'POST',
    body: JSON.stringify(applicantData),
  }, true);
};

export const fetchUserApplications = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/applications/me`, {},true);
};

export const fetchApplicationsForJob = async (jobId) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/applications/job/${jobId}`);
};

export const fetchAdminApplications = async () => {
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
    const res = await apiFetch(`${BACKEND_URL}/api/applications/admin/jobs-applications`, {}, true);
    if (res && (res as any).success && Array.isArray((res as any).data)) {
      return (res as any).data;
    }
    return [];
  } catch {
    return [];
  }
};