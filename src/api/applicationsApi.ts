import { apiFetch } from './apiFetch';

export const fetchApplicationsByJobId = async (jobId: string | number) => {
  try {
    const res = await apiFetch(`/api/applications/job/${jobId}`);
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
    const res = await apiFetch(`/api/applications/all`);
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
  return apiFetch(`/api/applications`, {
    method: 'POST',
    body: JSON.stringify(applicantData),
  }, true);
};

export const fetchUserApplications = async () => {
  return apiFetch(`/api/applications/me`, {},true);
};

export const fetchApplicationsForJob = async (jobId) => {
  return apiFetch(`/api/applications/job/${jobId}`);
};

export const fetchAdminApplications = async () => {
  try {
    const res = await apiFetch(`/api/applications/admin/jobs-applications`, {}, true);
    if (res && (res as any).success && Array.isArray((res as any).data)) {
      return (res as any).data;
    }
    return [];
  } catch {
    return [];
  }
};