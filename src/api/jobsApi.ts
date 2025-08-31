import { apiFetch } from './apiFetch';

export const updateJob = async (jobId: string | number, jobData: any) => {
  return apiFetch(`/api/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }, true);
};

export const createJob = async (jobData: {
  title: string;
  company: string;
  location: string;
  description: string;
}) => {
  return apiFetch(`/api/jobs`, {
    method: 'POST',
    body: JSON.stringify(jobData),
  }, true);
};


export const fetchJobs = async (page = 1, pageSize = 10) => {
  const url = `/api/jobs?page=${page}&pageSize=${pageSize}`;
  return apiFetch(url, {}, true);
};

export const fetchPublishedJobs = async (
  page = 1,
  pageSize = 10,
  filters?: { search?: string; location?: string }
) => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('pageSize', String(pageSize));
  params.append('status', 'published');
  if (filters?.search) params.append('search', filters.search);
  if (filters?.location) params.append('location', filters.location);
  const url = `/api/jobs/published?${params.toString()}`;
  return apiFetch(url);
};

export const applyToJob = async (jobId: string, userData: any) => {
  return apiFetch(`/api/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify(userData),
  }, true);
};

export const fetchJobById = async (jobId: string | number) => {
  return apiFetch(`/api/jobs/${jobId}`);
};

export const fetchLocations = async () => {
  return apiFetch(`/api/jobs/locations`);
};
export const deleteJob = async (jobId: string | number) => {
  return apiFetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  }, true);
};
